/** Visualization: https://xstate.js.org/viz/?gist=5158cd1138aaab449b556375906456ac */

import { BigNumber, ContractReceipt, ContractTransaction, ethers } from "ethers"
import type { RequireAtLeastOne } from "type-fest"
import {
  DoneInvokeEvent,
  ErrorPlatformEvent,
  assign,
  createMachine,
  send,
} from "xstate"

import {
  ArgentWalletContract__factory,
  ERC20__factory,
  ZkSync__factory,
} from "../generated"
import { isArgentWallet } from "../libs/argent"
import { getERC20BalancesAndAllowances } from "../libs/erc20"
import { selectAndCheckWallet, writeProvider } from "../libs/onboard"
import { showRampPromise } from "../libs/ramp"
import {
  ConfigResult as ZkSyncConfig,
  Token as ZkSyncToken,
  fetchConfig,
  fetchTokenList,
} from "../libs/zksyncApi"

export interface Token {
  address: string
  decimals: number
  symbol: string
  allowance: BigNumber
  balance: BigNumber
}

export type SendEvent =
  | { type: "START_PAIR" }
  | { type: "PAIR_SUCCESS" }
  | ({ type: "CHANGE_CONTEXT" } & RequireAtLeastOne<
      Omit<SendContext, "tokens">
    >)
  | ({ type: "CHANGE_TOKENS" } & RequireAtLeastOne<
      Omit<Omit<SendContext, "amount">, "contract">
    >)
  | { type: "PAIR_ERROR" }
  | { type: "SEND_APPROVE" }
  | { type: "SKIP_APPROVE" }
  | { type: "APPROVE_STAY" }
  | { type: "APPROVED" }
  | { type: "APPROVE_ERROR" }
  | { type: "SEND_TRANSACTION" }
  | { type: "SEND_SUCCESS" }
  | { type: "SEND_ERROR" }
  | { type: "START_RAMP" }

export interface SendContext {
  amount: string
  contract: string
  walletAddress: string
  isArgentWallet: boolean
  transactionHash: string | null
  hasZkSync: boolean
  zkSyncTokens: ZkSyncToken[]
  zkSyncConfig: ZkSyncConfig | null
  tokens: Token[]
}

export type SendValueType =
  | "readyToPair"
  | "pairing"
  | "approve"
  | "approving"
  | "send"
  | "sending"
  | "success"
  | "error"
  | "waitForTx"
  | "fetchBalancesAndAllowances"
  | "fetchTokens"
  | "ramp"

export type SendTypestate = {
  value: SendValueType
  context: SendContext
}

type FetchTokensRes = {
  zkSyncTokens: ZkSyncToken[]
  zkSyncConfig: ZkSyncConfig
}

export const sendMachineDefaultContext: SendContext = {
  amount: "",
  contract: ethers.constants.AddressZero,
  walletAddress: "",
  isArgentWallet: false,
  transactionHash: null,
  tokens: [],
  hasZkSync: false,
  zkSyncTokens: [],
  zkSyncConfig: null,
}

// viz: https://xstate.js.org/viz/?gist=9c7db6c5acd719f81bde32c219592593
export const sendMaschine = createMachine<
  SendContext,
  SendEvent,
  SendTypestate
>(
  {
    id: "send",
    initial: "readyToPair",
    context: sendMachineDefaultContext,
    states: {
      readyToPair: {
        on: { START_PAIR: "pairing", START_RAMP: "ramp" },
      },
      ramp: {
        invoke: {
          id: "ramp",
          src: showRampPromise,
          onDone: [
            {
              target: "success",
              cond: "purchaseDone",
            },
            { target: "readyToPair" },
          ],
          onError: "error",
        },
      },
      pairing: {
        invoke: {
          id: "pairing",
          src: async () => {
            await selectAndCheckWallet()

            const signer = writeProvider.getSigner(0)
            const address = await signer.getAddress()

            const isArgent = await isArgentWallet(address)

            return { isArgentWallet: isArgent }
          },
          onDone: {
            target: "fetchTokens",
            actions: assign({
              isArgentWallet: (context, event) =>
                event.data?.isArgentWallet ?? false,
            }),
          },
          onError: "readyToPair",
        },
      },
      fetchTokens: {
        invoke: {
          id: "fetchTokens",
          src: async (): Promise<FetchTokensRes> => {
            const [zkSyncTokens, zkSyncConfig] = await Promise.all([
              fetchTokenList(),
              fetchConfig(),
            ])
            return { zkSyncTokens, zkSyncConfig }
          },
          onDone: {
            target: "fetchBalancesAndAllowances",
            actions: assign((_context, event) => {
              const {
                data: { zkSyncTokens, zkSyncConfig },
              } = event as DoneInvokeEvent<FetchTokensRes>
              return { zkSyncTokens, zkSyncConfig }
            }),
          },
          onError: "error",
        },
      },
      fetchBalancesAndAllowances: {
        invoke: {
          id: "fetchBalancesAndAllowances",
          src: async (context): Promise<Token[]> => {
            const signer = writeProvider.getSigner(0)
            const { zkSyncTokens, zkSyncConfig } = context
            const balances = await getERC20BalancesAndAllowances(
              writeProvider,
              await signer.getAddress(),
              zkSyncTokens
                .filter(
                  (token) => token.address !== ethers.constants.AddressZero,
                )
                .map((token) => token.address),
              zkSyncConfig!.contract,
            )

            const tokens = zkSyncTokens
              .filter((token) => token.address !== ethers.constants.AddressZero)
              .map((token) => ({
                address: token.address,
                decimals: token.decimals,
                symbol: token.symbol,
                allowance:
                  balances.find((x) => x.address === token.address)
                    ?.allowance || BigNumber.from(0),
                balance:
                  balances.find((x) => x.address === token.address)?.balance ||
                  BigNumber.from(0),
              }))
              .sort((a, b) =>
                a.balance.gt(0) && b.balance.gt(0)
                  ? 0
                  : a.balance.gt(0)
                  ? -1
                  : 1,
              )

            tokens.unshift({
              address: ethers.constants.AddressZero,
              balance: await signer.getBalance(),
              decimals: 18,
              allowance: BigNumber.from(0),
              symbol: "ETH",
            })

            return tokens
          },
          onDone: {
            target: "approve",
            actions: [
              assign((_context, event) => {
                const { data: tokens } = event as DoneInvokeEvent<Token[]>
                return { tokens }
              }),
              "checkApproveSkip",
            ],
          },
          onError: "error",
        },
      },
      approve: {
        on: {
          SEND_APPROVE: "approving",
          SKIP_APPROVE: "send",
          APPROVE_STAY: "approve",
          CHANGE_TOKENS: { target: "approve", actions: ["setContext"] },
          CHANGE_CONTEXT: {
            target: "approve",
            actions: ["setContext", "checkApproveSkip"],
          },
        },
      },
      approving: {
        entry: "resetTransactionHash",
        invoke: {
          id: "approving",
          src: async (context): Promise<ContractTransaction> => {
            const { amount, contract, tokens, zkSyncConfig } = context
            const token = tokens.find((x) => x.address === contract)
            if (!token) throw Error("Token not found")
            const { decimals } = token
            const amountBn = ethers.utils.parseUnits(
              amount || "0",
              decimals || 0,
            )

            const signer = writeProvider.getSigner(0)
            const erc20token = ERC20__factory.connect(contract, signer)

            const approveTx = await erc20token
              .approve(zkSyncConfig!.contract, amountBn)
              .catch((e) => {
                console.error(e)
                throw Error("transaction_rejected")
              })

            return approveTx
          },
          onDone: {
            target: "waitForTx",
          },
          onError: [
            {
              target: "approve",
              cond: "noTransactionError",
            },
            { target: "error" },
          ],
        },
      },
      waitForTx: {
        entry: "setTransactionHash",
        invoke: {
          id: "waitForTx",
          src: async (_context, event) => {
            const promiseEvent = event as DoneInvokeEvent<ContractTransaction>
            return {
              prevEventType: event.type,
              txReceipt: await promiseEvent.data.wait(),
            }
          },
          onDone: [
            {
              target: "fetchBalancesAndAllowances",
              cond: "txWasApproval",
            },
            {
              target: "success",
            },
          ],
        },
      },
      send: {
        on: {
          SEND_TRANSACTION: "sending",
          CHANGE_TOKENS: { target: "send", actions: ["setContext"] },
          CHANGE_CONTEXT: {
            target: "approve",
            actions: ["setContext", "checkApproveSkip"],
          },
        },
      },
      sending: {
        entry: "resetTransactionHash",
        invoke: {
          id: "sending",
          src: async (context): Promise<ContractTransaction> => {
            const { amount, contract, tokens, walletAddress, zkSyncConfig } =
              context
            const token = tokens.find((x) => x.address === contract)
            if (!token) throw Error("Token not found")
            const { decimals } = token
            const signer = writeProvider.getSigner(0)
            const amountBn = ethers.utils.parseUnits(
              amount || "0",
              decimals || 0,
            )

            // L1 Transfer
            if (!context.hasZkSync) {
              // L1 Ether Transfer
              if (contract === ethers.constants.AddressZero) {
                return signer.sendTransaction({
                  to: walletAddress,
                  value: amountBn,
                })
              }
              // L1 ERC20 Transfer
              else {
                const erc20Contract = ERC20__factory.connect(contract, signer)

                return erc20Contract
                  .transfer(walletAddress, amountBn)
                  .catch((e) => {
                    console.error(e)

                    throw Error("transaction_rejected")
                  })
              }
            }

            // L1 -> L2 transfer
            const zkSync = ZkSync__factory.connect(
              zkSyncConfig!.contract,
              signer,
            )

            // if argent wallet is not sending ETH and allowance is too small, do multicall
            if (
              context.isArgentWallet &&
              contract !== ethers.constants.AddressZero &&
              token.allowance.lt(amountBn)
            ) {
              const argentWallet = ArgentWalletContract__factory.connect(
                await signer.getAddress(),
                signer,
              )
              const erc20Interface = ERC20__factory.createInterface()

              const mcTx = argentWallet
                .wc_multiCall([
                  {
                    to: contract,
                    value: 0,
                    data: erc20Interface.encodeFunctionData("approve", [
                      zkSyncConfig!.contract,
                      amountBn,
                    ]),
                  },
                  {
                    to: zkSyncConfig!.contract,
                    value: 0,
                    data: zkSync.interface.encodeFunctionData("depositERC20", [
                      contract,
                      amountBn,
                      walletAddress,
                    ]),
                  },
                ])
                .catch((e) => {
                  console.error(e)

                  throw Error("transaction_rejected")
                })

              return mcTx
            }

            const sendTx = await (contract === ethers.constants.AddressZero
              ? zkSync.depositETH(walletAddress, {
                  value: ethers.utils.parseEther(amount),
                })
              : zkSync.depositERC20(contract, amountBn, walletAddress)
            ).catch((e) => {
              console.error(e)

              throw Error("transaction_rejected")
            })

            return sendTx
          },
          onDone: { target: "waitForTx" },
          onError: [
            {
              target: "send",
              cond: "noTransactionError",
            },
            { target: "error" },
          ],
        },
      },
      success: {},
      error: {},
    },
  },
  {
    actions: {
      setContext: assign((_context, event) => {
        const { type, ...newContext } = event
        if (["CHANGE_CONTEXT", "CHANGE_TOKENS"].includes(type)) {
          return newContext
        }
        return {}
      }),
      checkApproveSkip: send((context) => {
        const { amount, contract, tokens, hasZkSync, isArgentWallet } = context
        const token = tokens.find((x) => x.address === contract)
        if (!token) return { type: "APPROVE_STAY" }
        const { allowance, decimals } = token
        const amountBn = ethers.utils.parseUnits(amount || "0", decimals || 0)

        if (
          !hasZkSync ||
          isArgentWallet ||
          contract === ethers.constants.AddressZero ||
          allowance.gte(amountBn)
        ) {
          return { type: "SKIP_APPROVE" }
        }
        return { type: "APPROVE_STAY" }
      }),
      resetTransactionHash: assign((_context) => ({
        transactionHash: null,
      })),
      setTransactionHash: assign((_contex, event) => ({
        transactionHash: (event as DoneInvokeEvent<ContractTransaction>).data
          .hash,
      })),
    },
    guards: {
      noTransactionError: (_context, event) => {
        if (
          (event as ErrorPlatformEvent)?.data?.message ===
          "transaction_rejected"
        ) {
          return true
        }
        return false
      },
      txWasApproval: (_context, event) => {
        const { data } = event as DoneInvokeEvent<{
          prevEventType: string
          txReceipt: ContractReceipt
        }>
        return data.prevEventType.includes("done.invoke.approving")
      },
      purchaseDone: (_context, event) => {
        const { data } = event as DoneInvokeEvent<boolean | undefined>
        return Boolean(data)
      },
    },
  },
)

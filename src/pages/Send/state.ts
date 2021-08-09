import { BigNumber, ethers } from "ethers"
import type { RequireAtLeastOne } from "type-fest"
import { ErrorPlatformEvent, assign, createMachine, send } from "xstate"
import create from "zustand"

import type { Token } from "../../containers/TokenSelect/state"
import { ERC20__factory, ZkSync__factory } from "../../generated"
import { ansStore } from "../../libs/ans"
import { onboard, web3 } from "../../libs/web3"

export const useTxStore = create<{ hash: string }>(() => ({
  hash: "",
}))

const zkSyncProxyAddress = "0x3a49f0f4cf80992976625e1af168f31a12ab5004"

type SendEvent =
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

interface SendContext {
  amount: string
  contract: string
  tokens: Token[]
  errored: boolean
  approved: {
    [address: string]: BigNumber
  }
}

export type ValueType =
  | "readyToPair"
  | "pairing"
  | "approve"
  | "approving"
  | "send"
  | "sending"
  | "success"
  | "error"

type SendTypestate = {
  value: ValueType
  context: SendContext
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
    context: {
      amount: "",
      contract: ethers.constants.AddressZero,
      tokens: [],
      approved: {},
      errored: false,
    },
    states: {
      readyToPair: {
        on: { START_PAIR: "pairing" },
      },
      pairing: {
        invoke: {
          id: "pairing",
          src: async () => {
            await onboard.walletSelect()
            await onboard.walletCheck()
          },
          onDone: "send",
          onError: "readyToPair",
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
        invoke: {
          id: "approving",
          src: async (context) => {
            // hide ui element
            useTxStore.setState({
              hash: "",
            })
            const { amount, contract, tokens } = context
            const token = tokens.find((x) => x.address === contract)
            if (!token) throw Error("Token not found")
            const { decimals } = token
            const amountBn = ethers.utils.parseUnits(
              amount || "0",
              decimals || 0,
            )

            const signer = web3.getSigner(0)
            const erc20token = ERC20__factory.connect(contract, signer)

            const approveTx = await erc20token
              .approve(zkSyncProxyAddress, amountBn)
              .catch((_e) => {
                throw Error("transaction_rejected")
              })

            useTxStore.setState({
              hash: approveTx.hash,
            })

            await approveTx.wait()

            return {
              address: contract,
              amount: amountBn,
            }
          },
          onDone: {
            target: "send",
            actions: [
              "setErrorFalse",
              assign((context, { data }) => ({
                approved: {
                  ...context.approved,
                  [data.address]: data.amount,
                },
              })),
            ],
          },
          onError: [
            {
              target: "approve",
              cond: "noTransactionError",
              actions: ["setErrorTrue"],
            },
            { target: "error", actions: ["setErrorFalse"] },
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
        invoke: {
          id: "sending",
          src: async (context) => {
            // hide ui element
            useTxStore.setState({
              hash: "",
            })
            const { amount, contract, tokens } = context
            const token = tokens.find((x) => x.address === contract)
            if (!token) throw Error("Token not found")
            const { decimals } = token
            const signer = web3.getSigner(0)
            const amountBn = ethers.utils.parseUnits(
              amount || "0",
              decimals || 0,
            )

            const zkSync = ZkSync__factory.connect(zkSyncProxyAddress, signer)

            const { walletAddress } = ansStore.getState()

            const sendTx = await (contract === ethers.constants.AddressZero
              ? zkSync.depositETH(walletAddress, {
                  value: ethers.utils.parseEther(amount),
                })
              : zkSync.depositERC20(contract, amountBn, walletAddress)
            ).catch((_e) => {
              throw Error("transaction_rejected")
            })

            useTxStore.setState({
              hash: sendTx.hash,
            })

            await sendTx.wait()
          },
          onDone: { target: "success", actions: ["setErrorFalse"] },
          onError: [
            {
              target: "send",
              cond: "noTransactionError",
              actions: ["setErrorTrue"],
            },
            { target: "error", actions: ["setErrorFalse"] },
          ],
        },
      },
      success: {
        type: "final",
      },
      error: {
        type: "final",
      },
    },
  },
  {
    actions: {
      setErrorTrue: assign(() => ({ errored: true } as SendContext)),
      setErrorFalse: assign(() => ({ errored: false } as SendContext)),
      setContext: assign((_context, event) => {
        const { type, ...newContext } = event
        if (["CHANGE_CONTEXT", "CHANGE_TOKENS"].includes(type)) {
          return newContext
        }
        return {}
      }),
      checkApproveSkip: send((context) => {
        const { amount, contract, tokens, approved } = context
        const token = tokens.find((x) => x.address === contract)
        if (!token) return { type: "APPROVE_STAY" }
        const { allowance, decimals } = token
        const amountBn = ethers.utils.parseUnits(amount || "0", decimals || 0)

        const alreadyApproved = approved[contract]
        if (
          contract === ethers.constants.AddressZero ||
          (alreadyApproved && alreadyApproved.gte(amountBn)) ||
          allowance.gte(amountBn)
        ) {
          return { type: "SKIP_APPROVE" }
        }
        return { type: "APPROVE_STAY" }
      }),
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
    },
  },
)

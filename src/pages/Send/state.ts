import { BigNumber, ethers } from "ethers"
import type { RequireAtLeastOne } from "type-fest"
import { assign, createMachine, send } from "xstate"
import create from "zustand"

import type { Token } from "../../containers/TokenSelect/state"
import { ERC20__factory, ZkSync__factory } from "../../generated"
import { onboard, web3 } from "../../libs/web3"

export const useTxStore = create<{ hash: string; chainId: number }>(() => ({
  hash: "",
  chainId: 0,
}))

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
          onDone: "approve",
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

            const approveTx = await erc20token.approve(
              "0x3a49f0f4cf80992976625e1af168f31a12ab5004",
              amountBn,
            )

            useTxStore.setState({
              hash: approveTx.hash,
              chainId: approveTx.chainId,
            })

            await approveTx.wait()

            // hide ui element
            useTxStore.setState({
              chainId: -1,
            })

            return {
              address: contract,
              amount: amountBn,
            }
          },
          onDone: {
            target: "send",
            actions: assign((context, { data }) => ({
              approved: {
                ...context.approved,
                [data.address]: data.amount,
              },
            })),
          },
          onError: "error",
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
            const { amount, contract, tokens } = context
            const token = tokens.find((x) => x.address === contract)
            if (!token) throw Error("Token not found")
            const { decimals } = token
            const signer = web3.getSigner(0)
            const amountBn = ethers.utils.parseUnits(
              amount || "0",
              decimals || 0,
            )

            const zkSync = ZkSync__factory.connect(
              "0x3a49f0f4cf80992976625e1af168f31a12ab5004",
              signer,
            )

            const sendTx = await (contract === ethers.constants.AddressZero
              ? zkSync.depositETH(await signer.getAddress(), {
                  value: ethers.utils.parseEther(amount),
                })
              : zkSync.functions.depositERC20(
                  contract,
                  amountBn,
                  await signer.getAddress(),
                ))

            useTxStore.setState({
              hash: sendTx.hash,
              chainId: sendTx.chainId,
            })

            await sendTx.wait()

            // hide ui element
            useTxStore.setState({
              chainId: -1,
            })
          },
          onDone: "success",
          onError: "error",
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
      setContext: assign((_context, event) => {
        const { type, ...newContext } = event
        if (["CHANGE_CONTEXT", "CHANGE_TOKENS"].includes(type)) {
          return newContext
        }
        return {}
      }),
      checkApproveSkip: send((context, _event) => {
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
  },
)
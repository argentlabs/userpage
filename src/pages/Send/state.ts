import { ethers } from "ethers"
import type { RequireAtLeastOne } from "type-fest"
import { assign, createMachine, send } from "xstate"

import type { Token } from "../../containers/TokenSelect/state"
import { onboard } from "../../libs/web3"

type SendEvent =
  | { type: "START_PAIR" }
  | { type: "PAIR_SUCCESS" }
  | ({ type: "CHANGE_CONTEXT" } & RequireAtLeastOne<SendContext>)
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
    },
    states: {
      readyToPair: {
        on: { START_PAIR: "pairing" },
      },
      pairing: {
        invoke: {
          id: "pair",
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
          CHANGE_CONTEXT: {
            target: "approve",
            actions: ["setContext", "checkApproveSkip"],
          },
        },
      },
      approving: {
        on: { APPROVED: "send", APPROVE_ERROR: "error" },
      },
      send: {
        on: {
          SEND_TRANSACTION: "sending",
          CHANGE_CONTEXT: {
            target: "approve",
            actions: ["setContext", "checkApproveSkip"],
          },
        },
      },
      sending: {
        on: { SEND_SUCCESS: "success", SEND_ERROR: "error" },
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
        if (type === "CHANGE_CONTEXT") {
          return newContext
        }
        return {}
      }),
      checkApproveSkip: send((context, _event) => {
        const { amount, contract, tokens } = context
        const token = tokens.find((x) => x.address === contract)
        if (!token) return { type: "APPROVE_STAY" }
        const { allowance, decimals } = token
        const amountBn = ethers.utils.parseUnits(amount || "0", decimals || 0)

        if (
          contract === ethers.constants.AddressZero ||
          allowance.gte(amountBn)
        ) {
          return { type: "SKIP_APPROVE" }
        }
        return { type: "APPROVE_STAY" }
      }),
    },
  },
)

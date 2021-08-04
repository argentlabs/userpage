import { assign, createMachine } from "xstate"

import { onboard } from "../../libs/web3"

type SendEvent =
  | { type: "START_PAIR" }
  | { type: "PAIR_SUCCESS" }
  | ({ type: "CHANGE_AMOUNT" } & SendContext)
  | { type: "PAIR_ERROR" }
  | { type: "SEND_APPROVE" }
  | { type: "APPROVE_DENIED" }
  | { type: "APPROVED" }
  | { type: "APPROVE_ERROR" }
  | { type: "SEND_TRANSACTION" }
  | { type: "SEND_SUCCESS" }
  | { type: "SEND_ERROR" }

interface SendContext {
  amount: string
  contract: string
}

export type ValueType =
  | "readyToPair"
  | "pairing"
  | "paired"
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
      amount: "0",
      contract: "0x0",
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
          onDone: "paired",
          onError: "readyToPair",
        },
      },
      paired: {
        on: { CHANGE_AMOUNT: { target: "approve", actions: ["setContext"] } },
      },
      approve: {
        on: { SEND_APPROVE: "approving", APPROVE_DENIED: "paired" },
      },
      approving: {
        on: { APPROVED: "send", APPROVE_ERROR: "error" },
      },
      send: {
        on: {
          SEND_TRANSACTION: "sending",
          CHANGE_AMOUNT: { target: "approve", actions: ["setContext"] },
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
      setContext: (_context, event) => {
        if (event.type === "CHANGE_AMOUNT") {
          assign({
            amount: event.amount,
            contract: event.contract,
          })
        }
      },
    },
  },
)

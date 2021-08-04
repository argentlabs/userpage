import { createMachine } from "xstate"

type SendEvent =
  | { type: "START_PAIR" }
  | { type: "PAIR_SUCCESS" }
  | { type: "CHANGE_AMOUNT"; amount: number; contract: string }
  | { type: "PAIR_ERROR" }
  | { type: "SEND_APPROVE" }
  | { type: "APPROVE_DENIED" }
  | { type: "APPROVED" }
  | { type: "APPROVE_ERROR" }
  | { type: "SEND_TRANSACTION" }
  | { type: "SEND_SUCCESS" }
  | { type: "SEND_ERROR" }

interface SendContext {
  amount: number
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
>({
  id: "send",
  initial: "readyToPair",
  context: {
    amount: 0,
    contract: "0x0",
  },
  states: {
    readyToPair: {
      on: { START_PAIR: "pairing" },
    },
    pairing: {
      on: { PAIR_SUCCESS: "paired", PAIR_ERROR: "readyToPair" },
    },
    paired: {
      on: { CHANGE_AMOUNT: "approve" },
    },
    approve: {
      on: { SEND_APPROVE: "approving", APPROVE_DENIED: "paired" },
    },
    approving: {
      on: { APPROVED: "send", APPROVE_ERROR: "error" },
    },
    send: {
      on: { SEND_TRANSACTION: "sending", CHANGE_AMOUNT: "approve" },
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
})

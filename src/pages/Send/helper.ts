import type { State } from "xstate"

import type { SendValueType } from "../../states/send"

export const stateMatchesFactory =
  (state: State<any, any>) => (values: Array<SendValueType>) =>
    values.some(state.matches)

export const connectScreens: Array<SendValueType> = ["readyToPair", "pairing"]

export const amountScreens: Array<SendValueType> = [
  "fetchTokens",
  "fetchBalancesAndAllowances",
  "approve",
  "send",
]

export const inFlightScreens: Array<SendValueType> = [
  "sending",
  "approving",
  "waitForTx",
  "ramp",
]

export const notOverwriteableScreens: Array<SendValueType> = ["readyToPair"]

/** Visualization: https://xstate.js.org/viz/?gist=b8e9ec176bcdfb673d6e3d19d237803e */

import {
  DoneInvokeEvent,
  ErrorPlatformEvent,
  assign,
  createMachine,
  send,
} from "xstate"

import { fetchAns } from "../libs/ans"
import { SendContext, sendMachineDefaultContext, sendMaschine } from "./send"

export type RouterEvent =
  | { type: "NOOP" }
  | { type: "PUSH_SEND" }
  | { type: "PUSH_HOME" }
  | { type: "PUSH_VAULT" }

export interface RouterContext {
  name: string
  walletAddress: string
  ens: string
  walletDeployed: boolean
  hasZkSync: boolean
}

export type RouterValueType =
  | "loading"
  | "home"
  | "vault"
  | "claim"
  | "send"
  | "404"

export type RouterTypestate = {
  value: RouterValueType
  context: RouterContext
}

const getNameFromGlobal = () => {
  const overwriteName = new URLSearchParams(window.location.search).get(
    "__overwriteName",
  )
  const domainSplitByDot = window.location.hostname.split(".")
  const name =
    overwriteName || (domainSplitByDot.length > 2 ? domainSplitByDot[0] : "")

  if (overwriteName) {
    window.history.replaceState("", "", window.location.pathname)
  }

  return name
}

const isNameClaimable = (name: string): boolean => {
  return name.length >= 5 && name.length <= 30
}

export const createRouterMachine = (history: {
  push: (path: string) => void
  replace: (path: string) => void
  location: {
    pathname: string
    search: string
  }
}) =>
  createMachine<RouterContext, RouterEvent, RouterTypestate>(
    {
      id: "router",
      initial: "loading",
      context: {
        name: "",
        walletAddress: "0x0",
        ens: "",
        walletDeployed: false,
        hasZkSync: false,
      },
      states: {
        loading: {
          entry: ["setName"],
          invoke: {
            id: "getWallet",
            src: async (context): Promise<RouterContext> => {
              const ans = await fetchAns(context.name)
              return {
                name: context.name,
                ...ans,
              }
            },
            onDone: [
              {
                target: "home",
                cond: "hasZkSyncWallet",
                actions: ["assignContext", "respectPath"],
              },
              {
                target: "vault",
                actions: "assignContext",
              },
            ],
            onError: [
              {
                target: "claim",
                cond: "canVisitClaim",
              },
              {
                target: "404",
                cond: "is404",
              },
              {
                target: "error",
              },
            ],
          },
        },
        home: {
          entry: ["navigateHome"],
          on: {
            PUSH_SEND: "send",
            PUSH_VAULT: "vault",
          },
          meta: {
            path: "/",
          },
        },
        vault: {
          entry: ["navigateVault"],
          type: "final",
          meta: {
            path: "/vault",
          },
        },
        claim: {
          entry: ["navigateClaim"],
          type: "final",
          meta: {
            path: "/claim",
          },
        },
        "404": {
          entry: ["navigate404"],
          type: "final",
          meta: {
            path: "/404",
          },
        },
        error: {
          type: "final",
        },
        send: {
          entry: ["navigateSend"],
          invoke: {
            id: "sendMachine",
            src: sendMaschine,
            data: (context): SendContext => ({
              ...sendMachineDefaultContext,
              walletAddress: context.walletAddress,
            }),
          },
          on: {
            PUSH_HOME: "home",
          },
          meta: {
            path: "/send",
          },
        },
      },
    },
    {
      actions: {
        assignContext: assign((_context, event) => {
          const promiseEvent = event as DoneInvokeEvent<RouterContext>
          if (promiseEvent?.data) {
            return {
              ...promiseEvent.data,
            }
          }
          return {}
        }),
        respectPath: send(() => {
          if (history.location.pathname === "/send")
            return {
              type: "PUSH_SEND",
            }
          if (history.location.pathname === "/vault")
            return {
              type: "PUSH_VAULT",
            }
          return {
            type: "NOOP",
          }
        }),
        setName: assign((context) => ({
          ...context,
          name: getNameFromGlobal(),
        })),
        navigateHome: (_context, _event) => {
          history?.push("/")
        },
        navigateSend: (_context, _event) => {
          history?.push("/send")
        },
        navigateVault: () => {
          history?.push("/vault")
        },
        navigateClaim: (_context, _event) => {
          history?.replace("/claim")
        },
        navigate404: (_context, _event) => {
          history?.replace("/404")
        },
      },
      guards: {
        hasZkSyncWallet: (_context, event) => {
          const promiseEvent = event as DoneInvokeEvent<RouterContext>
          return Boolean(promiseEvent?.data?.hasZkSync)
        },
        canVisitClaim: (_context, event) => {
          const promiseEvent = event as ErrorPlatformEvent
          const name = getNameFromGlobal()
          if (
            promiseEvent.data?.message === "Not found" &&
            isNameClaimable(name)
          ) {
            return true
          }

          return false
        },
        is404: (_context, event) => {
          const promiseEvent = event as ErrorPlatformEvent
          if (promiseEvent.data?.message === "Not found") {
            return true
          }

          return false
        },
      },
    },
  )

import { useActor, useInterpret, useSelector } from "@xstate/react"
import { FC, createContext, useContext, useMemo } from "react"
import { useHistory } from "react-router-dom"
import {
  DoneInvokeEvent,
  ErrorPlatformEvent,
  Interpreter,
  assign,
  createMachine,
  send,
} from "xstate"

import { fetchAns } from "../libs/ans"

type SendEvent =
  | { type: "NOOP" }
  | { type: "PUSH_SEND" }
  | { type: "PUSH_HOME" }
  | { type: "PUSH_VAULT" }

interface SendContext {
  name: string
  walletAddress: string
  ens: string
  walletDeployed: boolean
  hasZkSync: boolean
}

type ValueType = "loading" | "home" | "vault" | "claim" | "send" | "404"

type SendTypestate = {
  value: ValueType
  context: SendContext
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
  createMachine<SendContext, SendEvent, SendTypestate>(
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
            src: async (context): Promise<SendContext> => {
              const { ens, l2, walletAddress, walletDeployed } = await fetchAns(
                context.name,
              )
              return {
                name: context.name,
                ens,
                walletAddress,
                walletDeployed,
                hasZkSync:
                  l2?.walletStatus?.find?.((w) => w.type === "ZK_SYNC")
                    ?.hasWallet ?? false,
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
        },
        vault: {
          entry: ["navigateVault"],
          type: "final",
        },
        claim: {
          entry: ["navigateClaim"],
          type: "final",
        },
        "404": {
          entry: ["navigate404"],
          type: "final",
        },
        error: {
          type: "final",
        },
        send: {
          entry: ["navigateSend"],
          // invoke: {
          //   src: async () => {
          //     //   await new Promise((res) => {
          //     //     setTimeout(res, 2000)
          //     //   })
          //   },
          //   onDone: "home",
          // },
          on: {
            PUSH_HOME: "home",
          },
        },
      },
    },
    {
      actions: {
        assignContext: assign((_context, event) => {
          const promiseEvent = event as DoneInvokeEvent<SendContext>
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
          const promiseEvent = event as DoneInvokeEvent<SendContext>
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

const GlobalRouterStateContext = createContext<
  Interpreter<SendContext, any, SendEvent, SendTypestate>
>(null as any)

export const GlobalRouterStateProvider: FC = (props) => {
  const history = useHistory()
  const routerMachine = useMemo(() => {
    console.log("ROUTER MACHINE INIT")
    return createRouterMachine(history)
  }, [history])
  const routerService = useInterpret(routerMachine)

  return (
    <GlobalRouterStateContext.Provider value={routerService}>
      {props.children}
    </GlobalRouterStateContext.Provider>
  )
}

export const useRouterMachine = () => {
  const globalRouterService = useContext(GlobalRouterStateContext)
  return useActor(globalRouterService)
}

export const useRouterContextSelector = () => {
  const globalRouterService = useContext(GlobalRouterStateContext)
  return useSelector(globalRouterService, (state) => state.context)
}

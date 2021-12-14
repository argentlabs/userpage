/** Visualization: https://xstate.js.org/viz/?gist=b8e9ec176bcdfb673d6e3d19d237803e */

import {
  DoneInvokeEvent,
  ErrorPlatformEvent,
  assign,
  createMachine,
  send,
} from "xstate"

import { getUserInfo } from "../libs/ans"
import {
  GalleryContext,
  galleryMachine,
  galleryMachineDefaultContext,
} from "./nftGallery"
import { SendContext, sendMachineDefaultContext, sendMaschine } from "./send"

export type RouterEvent =
  | { type: "NOOP" }
  | { type: "PUSH_SEND" }
  | { type: "PUSH_HOME" }
  | { type: "PUSH_VAULT" }
  | { type: "PUSH_GALLERY" }
  | {
      type: "PUSH_GALLERY_DETAIL"
      tokenId: string
      assetContractAddress: string
    }

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
  | "gallery"
  | "gallery_detail"
  | "404"

export type RouterTypestate = {
  value: RouterValueType
  context: RouterContext
}

const getNameFromGlobal = () => {
  const overwriteName = new URLSearchParams(window.location.search).get(
    "__overwriteName",
  )
  const domainBeforeArgent = window.location.hostname.split(".argent")[0]
  const name = overwriteName || domainBeforeArgent

  if (overwriteName) {
    window.history.replaceState("", "", window.location.pathname)
  }

  return name
}

const isNameClaimable = (name: string): boolean => {
  return name.length >= 5 && name.length <= 30 && !name.includes(".")
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
              return getUserInfo(context.name)
            },
            onDone: [
              {
                target: "home",
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
            PUSH_GALLERY: "gallery",
            PUSH_GALLERY_DETAIL: "gallery_detail",
          },
          meta: {
            path: "/",
          },
        },
        gallery: {
          entry: ["navigateGallery"],
          invoke: {
            id: "galleryMachine",
            src: galleryMachine,
            data: (context): GalleryContext => ({
              ...galleryMachineDefaultContext,
              walletAddress: context.walletAddress,
            }),
          },
          on: {
            PUSH_HOME: "home",
            PUSH_SEND: "send",
            PUSH_VAULT: "vault",
            PUSH_GALLERY_DETAIL: "gallery_detail",
          },
          meta: {
            path: "/gallery",
          },
        },
        gallery_detail: {
          entry: ["navigateGalleryDetail"],
          invoke: {
            id: "galleryMachine",
            src: galleryMachine,
            data: (context): GalleryContext => ({
              ...galleryMachineDefaultContext,
              walletAddress: context.walletAddress,
            }),
          },
          on: {
            PUSH_HOME: "home",
            PUSH_GALLERY: "gallery",
            PUSH_GALLERY_DETAIL: "gallery_detail",
          },
          meta: {
            path: "/gallery/:id",
          },
        },
        vault: {
          entry: ["navigateVault"],
          on: {
            PUSH_HOME: "send",
          },
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
              hasZkSync: context.hasZkSync,
            }),
          },
          on: {
            PUSH_VAULT: "vault",
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
          if (history.location.pathname === "/gallery")
            return {
              type: "PUSH_GALLERY",
            }
          if (history.location.pathname.match(/\/gallery\/.+\/.+/))
            return {
              type: "PUSH_GALLERY_DETAIL",
              tokenId:
                window.location.pathname.split("/")[
                  window.location.pathname.split("/").length - 1
                ],
              assetContractAddress:
                window.location.pathname.split("/")[
                  window.location.pathname.split("/").length - 2
                ],
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
        navigateGallery: (_context, _event) => {
          history?.push("/gallery")
        },
        navigateGalleryDetail: (_context, _event) => {
          if (_event.type === "PUSH_GALLERY_DETAIL")
            history?.push(
              `/gallery/${_event.assetContractAddress}/${_event.tokenId}`,
            )
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

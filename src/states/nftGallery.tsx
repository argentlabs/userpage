/** Visualization: https://xstate.js.org/viz/?gist=b8e9ec176bcdfb673d6e3d19d237803e */

import { DoneInvokeEvent, assign, createMachine } from "xstate"

import { fetchNfts, getNftMediaUrl } from "../libs/opensea"
import { ImageProp } from "../pages/Gallery/Gallery.style"

export type GalleryEvent = { type: "NOOP" }

export interface GalleryContext {
  nfts: ImageProp[]
  walletAddress: string
}

export type GalleryValueType = "loading" | "success" | "error"

export type GalleryTypestate = {
  value: GalleryValueType
  context: GalleryContext
}

export const galleryMachineDefaultContext: GalleryContext = {
  nfts: [],
  walletAddress: "",
}

export const galleryMachine = createMachine<
  GalleryContext,
  GalleryEvent,
  GalleryTypestate
>(
  {
    id: "gallery",
    initial: "loading",
    context: galleryMachineDefaultContext,
    states: {
      loading: {
        invoke: {
          id: "loadNfts",
          src: async (context): Promise<GalleryContext> => {
            return fetchNfts(context.walletAddress).then((result) => ({
              walletAddress: context.walletAddress,
              nfts: result.map((x) => ({
                url: getNftMediaUrl(x),
                id: x.token_id,
                assetContractAddress: x.asset_contract.address,
              })),
            }))
          },
          onDone: [
            {
              target: "success",
              actions: "assignContext",
            },
          ],
          onError: [
            {
              target: "error",
            },
          ],
        },
      },
      success: {},
      error: {},
    },
  },
  {
    actions: {
      assignContext: assign((_context, event) => {
        const promiseEvent = event as DoneInvokeEvent<GalleryContext>
        if (promiseEvent?.data) {
          return {
            ...promiseEvent.data,
          }
        }
        return {}
      }),
    },
  },
)

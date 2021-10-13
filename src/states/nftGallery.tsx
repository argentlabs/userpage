/** Visualization: https://xstate.js.org/viz/?gist=b8e9ec176bcdfb673d6e3d19d237803e */

import { map, mergeMap } from "rxjs"
import { DoneInvokeEvent, assign, createMachine } from "xstate"

import { fetchAllNfts, getBlobUrl, getNftMedia } from "../libs/opensea"
import { ImageProp } from "../pages/Gallery/Grid"

const imageMimes = ["image/png", "image/jpeg", "image/gif"]
export const isImageMime = (mime: string) => imageMimes.includes(mime)

export type GalleryEvent =
  | { type: "NOOP" }
  | { type: "ADD_NFT"; nft: ImageProp }

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
          id: "loading",
          src: (context, _event) =>
            fetchAllNfts(context.walletAddress).pipe(
              mergeMap(async (nft) => {
                try {
                  const nftBlob = await getNftMedia(nft)
                  const nftSrc = getBlobUrl(nftBlob)
                  const type = imageMimes.includes(nftBlob.type)
                    ? "img"
                    : "video"
                  const htmlEl = document.createElement(type)
                  const dimensions = await new Promise<{
                    width: number
                    height: number
                  }>((res, rej) => {
                    if (type === "img")
                      htmlEl.onload = () => {
                        res({ width: htmlEl.width, height: htmlEl.height })
                      }
                    if (type === "video")
                      htmlEl.onloadeddata = () => {
                        res({ width: htmlEl.width, height: htmlEl.height })
                      }
                    htmlEl.onerror = () => {
                      rej()
                    }
                    htmlEl.src = nftSrc
                  })
                  return {
                    blob: nftBlob,
                    id: nft.token_id,
                    assetContractAddress: nft.asset_contract.address,
                    collectionSlug: nft.collection.slug,
                    collectionName: nft.collection.name,
                    ...dimensions,
                  }
                } catch {
                  return false
                }
              }),
              map((nft) => {
                if (nft) {
                  return { type: "ADD_NFT", nft }
                } else {
                  return { type: "NOOP" }
                }
              }),
            ),
          onDone: "success",
        },
        on: {
          ADD_NFT: { actions: "pushNft" },
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
      pushNft: assign((context, event) => {
        if (event.type === "ADD_NFT" && event.nft) {
          return {
            nfts: [...context.nfts, event.nft],
          }
        }
        return {}
      }),
    },
  },
)

/** Visualization: https://xstate.js.org/viz/?gist=b8e9ec176bcdfb673d6e3d19d237803e */

import { map, mergeMap } from "rxjs"
import { DoneInvokeEvent, assign, createMachine } from "xstate"

import { determineNftType } from "../libs/nft"
import {
  fetchAllNfts,
  getBlobUrl,
  getNftMedia,
  getPosterMedia,
} from "../libs/opensea"
import { ImageProp } from "../pages/Gallery/Grid"

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
                  const type = determineNftType(nftBlob.type)
                  const dimensions = await new Promise<{
                    width: number
                    height: number
                  }>((res, rej) => {
                    if (type === "image") {
                      const htmlEl = document.createElement("img")
                      htmlEl.onload = () => {
                        res({ width: htmlEl.width, height: htmlEl.height })
                      }
                      htmlEl.onerror = () => {
                        rej()
                      }
                      htmlEl.src = nftSrc
                    } else if (type === "video") {
                      const htmlEl = document.createElement("video")
                      htmlEl.onloadeddata = () => {
                        res({ width: htmlEl.width, height: htmlEl.height })
                      }
                      htmlEl.onerror = () => {
                        rej()
                      }
                      htmlEl.src = nftSrc
                    } else if (type === "audio") {
                      const htmlEl = document.createElement("audio")
                      htmlEl.onloadeddata = () => {
                        res({ width: 200, height: 50 })
                      }
                      htmlEl.onerror = () => {
                        rej()
                      }
                      htmlEl.src = nftSrc
                    } else if (type === "model") {
                      res({ width: 200, height: 200 })
                    }
                  })

                  const poster =
                    type === "audio"
                      ? getBlobUrl(await getPosterMedia(nft))
                      : undefined

                  return {
                    blob: nftBlob,
                    poster,
                    id: nft.token_id,
                    assetContractAddress: nft.asset_contract.address,
                    collectionSlug: nft.collection.slug,
                    collectionName: nft.collection.name,
                    ...dimensions,
                  }
                } catch (e) {
                  console.log(e)
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

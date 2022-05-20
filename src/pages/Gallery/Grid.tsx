import { useWindowResize } from "beautiful-react-hooks"
import { FC, useMemo, useState } from "react"
import styled, { keyframes } from "styled-components"
import { prop } from "styled-tools"

import Center from "../../components/Center"
import CaretLeft from "../../components/Svgs/CaretLeft"
import { determineNftType } from "../../libs/nft"
import { getBlobUrl } from "../../libs/opensea"
import { DisplayModeButton, DisplayModeWrapper } from "./Gallery.style"
import { ImageFrame } from "./ImageFrame"

type DisplayMode = "all" | "collection"

export type ImageProp = {
  blob: Blob
  id: string
  assetContractAddress: string
  collectionName: string
  collectionSlug: string
  width: number
  height: number
}

interface ColumnProps {
  gap: number
}

export const Column = styled.div<ColumnProps>`
  display: flex;
  flex-direction: column;
  gap: ${prop("gap")}px;
`

const WaitAndShowAnimation = keyframes`
  0% {
    opacity: 0;
  }
  90% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

const NotFoundText = styled.h3`
  font-weight: bold;
  animation: ${WaitAndShowAnimation} 5s ease-in-out;
`

interface GridProps {
  columns: number
  gap: number
  width?: string
}

export const GridWrapper = styled.div<GridProps>`
  width: ${prop("width", "calc(100% - 512px)")};

  display: grid;
  grid-template-columns: repeat(${prop("columns")}, 1fr);
  gap: ${prop("gap")}px;
`

export const PreloadContainer = styled.div`
  position: absolute;
  opacity: 0;
  user-select: none;
  top: -999999px;
  z-index: -100;
`

export const Grid: FC<{
  images: ImageProp[]
  onImageClick?: (tokenId: string, assetContractAddress: string) => void
}> = ({ images, onImageClick, ...props }) => {
  const [width, setWidth] = useState(window.innerWidth)
  useWindowResize(() => {
    setWidth(window.innerWidth)
  })
  const columnsCount = useMemo(
    () => (width > 1000 ? 3 : width > 420 ? 2 : 1),
    [width],
  )

  const gap = 16
  const border = 32
  const widthContainer = useMemo(
    () =>
      width >= 1280
        ? "calc(100% - 35vw)"
        : width > 480
        ? "calc(100% - 64px)"
        : "calc(100% - 48px)",
    [width],
  )

  const [displayMode, setDisplayMode] = useState<DisplayMode>("all")
  const [selectedCollection, setSelectedCollection] = useState("")
  const selectCollection = (collection: string) => {
    setSelectedCollection(collection)
    setDisplayMode("all")
  }
  const exitCollection = () => {
    setSelectedCollection("")
    setDisplayMode("collection")
  }

  const [columns, collectionsCount] = useMemo(() => {
    const collectionsCount: { [collectionSlug: string]: number } = {}

    return [
      images.reduce(
        (acc, nft) => {
          const output = [...acc]
          const tinyestIndex = acc.findIndex(
            (kvs) => kvs.acc === Math.min(...acc.map((x) => x.acc)),
          )

          if (displayMode === "all") {
            if (
              !selectedCollection ||
              selectedCollection === nft.collectionSlug
            )
              output.splice(tinyestIndex, 1, {
                ...output[tinyestIndex],
                items: {
                  ...output[tinyestIndex].items,
                  [nft.id]: {
                    aspectRatio: nft.height / nft.width || 0,
                    position: Object.keys(output[tinyestIndex].items).length,
                  },
                },
              })
          } else {
            const collectionCount = collectionsCount[nft.collectionSlug]
            if (collectionCount) {
              collectionsCount[nft.collectionSlug]++
            } else {
              collectionsCount[nft.collectionSlug] = 1
              output.splice(tinyestIndex, 1, {
                ...output[tinyestIndex],
                items: {
                  ...output[tinyestIndex].items,
                  [nft.id]: {
                    aspectRatio: nft.height / nft.width || 0,
                    position: Object.keys(output[tinyestIndex].items).length,
                  },
                },
              })
            }
          }

          return output.map((col) => ({
            ...col,
            acc: Object.values(col.items).reduce(
              (a, v) => a + v.aspectRatio,
              0,
            ),
          }))
        },
        new Array(columnsCount).fill({ acc: 0, items: [] }) as Array<{
          acc: number
          items: {
            [key: string]: { position?: number; aspectRatio: number }
          }
        }>,
      ),
      collectionsCount,
    ]
  }, [images, columnsCount, border, gap, displayMode, selectedCollection])

  const hasNoNfts = images.length === 0

  return (
    <>
      <DisplayModeWrapper style={{ width: widthContainer }}>
        {selectedCollection ? (
          <>
            <div
              style={{ cursor: "pointer", marginBottom: "-2px" }}
              onClick={() => exitCollection()}
            >
              <CaretLeft height="13px" />
            </div>
            <DisplayModeButton
              style={{ marginLeft: "-18px" }}
              onClick={() => exitCollection()}
            >
              {
                images.find((img) => img.collectionSlug === selectedCollection)!
                  .collectionName
              }
            </DisplayModeButton>
          </>
        ) : (
          <>
            <span>View by</span>
            <DisplayModeButton
              active={displayMode === "all"}
              onClick={() => setDisplayMode("all")}
            >
              All
            </DisplayModeButton>
            <DisplayModeButton
              active={displayMode === "collection"}
              onClick={() => setDisplayMode("collection")}
            >
              Collection
            </DisplayModeButton>
          </>
        )}
      </DisplayModeWrapper>

      {hasNoNfts && (
        <Center
          direction="column"
          style={{ margin: "64px", textAlign: "center" }}
        >
          <NotFoundText>You do not own any displayable NFTs</NotFoundText>
        </Center>
      )}
      {!hasNoNfts && (
        <GridWrapper gap={gap} columns={columnsCount} width={widthContainer}>
          {columns.map((col, i) => {
            return (
              <Column gap={gap} key={i}>
                {Object.entries(col.items)
                  .sort(
                    ([, v1], [, v2]) =>
                      (v1.position ?? Infinity) - (v2.position ?? Infinity),
                  )
                  .map(([id], i) => {
                    const item = images.find((i) => i.id === id)!
                    return (
                      <ImageFrame
                        key={id}
                        type={determineNftType(item.blob.type)}
                        url={getBlobUrl(item.blob)}
                        border={`${border}px`}
                        details={
                          displayMode === "collection"
                            ? {
                                collectionName: item.collectionName,
                                collectionSlug: item.collectionSlug,
                                collectionAmount:
                                  collectionsCount[item.collectionSlug],
                              }
                            : undefined
                        }
                        clickable
                        onClick={() => {
                          if (displayMode === "collection") {
                            return selectCollection(item.collectionSlug)
                          } else onImageClick?.(id, item.assetContractAddress)
                        }}
                      />
                    )
                  })}
              </Column>
            )
          })}
        </GridWrapper>
      )}
    </>
  )
}

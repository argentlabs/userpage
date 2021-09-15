import { useWindowResize } from "beautiful-react-hooks"
import { FC, useEffect, useMemo, useState } from "react"
import styled, { keyframes } from "styled-components"
import { prop } from "styled-tools"

import Center from "../../components/Center"
import { useDebounceUpdate } from "../../hooks/useDebounceUpdate"
import { useDelayedLoading } from "../../hooks/useDelayedLoading"
import { Dimensions, ImageFrame } from "./ImageFrame"

export type ImageProp = {
  url: string
  id: string
  assetContractAddress: string
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

const loadingAnimation = keyframes`
  0% {
    left:0%;
    right:100%;
    width:0%;
  }
  20% {
    left:0%;
    right:50%;
    width:50%;
  }
  80% {
    right:0%;
    left:50%;
    width:50%;
  }
  100% {
    left:100%;
    right:0%;
    width:0%;
  }
`

const LoadingStrip = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 12px;

  ::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    height: 12px;
    width: 0;
    background: radial-gradient(#ff875b, transparent 50%);
    animation: ${loadingAnimation} 2s linear infinite;
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
  margin: 100px 0;
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
  const [errorCount, setErrorCount] = useState(0)

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

  const [dimensions, setDimensions] = useState<{ [i: string]: Dimensions }>({})

  const setDimensionsDebounced = useDebounceUpdate(
    setDimensions,
    [100, 500, 1000],
  )

  const [prevColumns, setPrevColumns] = useState(
    new Array(columnsCount).fill({ acc: 0, items: [] }) as Array<{
      acc: number
      items: {
        [key: string]: { position?: number; aspectRatio: number }
      }
    }>,
  )

  useEffect(() => {
    setPrevColumns(
      new Array(columnsCount).fill({ acc: 0, items: [] }) as Array<{
        acc: number
        items: {
          [key: string]: { position?: number; aspectRatio: number }
        }
      }>,
    )
  }, [columnsCount])

  const columns = useMemo(() => {
    const re = Object.entries(dimensions).reduce((acc, [k, v]) => {
      const output = [...acc]

      const tinyestIndex = acc.findIndex(
        (kvs) => kvs.acc === Math.min(...acc.map((x) => x.acc)),
      )
      //check if already in there
      const existingItem = output.find((x) => !!x.items[k])?.items[k]

      if (!existingItem) {
        output.splice(tinyestIndex, 1, {
          ...output[tinyestIndex],
          items: {
            ...output[tinyestIndex].items,
            [k]: {
              aspectRatio: v.domHeight,
              position: Object.keys(output[tinyestIndex].items).length,
            },
          },
        })
      } else if (existingItem.aspectRatio !== v.domHeight) {
        const existingItemColIndex = output.findIndex((x) => !!x.items[k])

        const newItems = {
          ...output[existingItemColIndex].items,
          [k]: {
            ...existingItem,
            aspectRatio: v.domHeight,
          },
        }

        output.splice(existingItemColIndex, 1, {
          ...output[existingItemColIndex],
          items: newItems,
        })
      }

      return output.map((col) => ({
        ...col,
        acc: Object.values(col.items).reduce(
          (a, v, i) => a + v.aspectRatio + 2 * border + (i ? gap : 0),
          0,
        ),
      }))
    }, prevColumns)
    setPrevColumns(re)
    return re
  }, [dimensions, columnsCount, border, gap])

  const hasNoNfts = images.length === 0
  const finishedLoading =
    columns.reduce(
      (acc, col) => acc + Object.keys(col.items).length,
      errorCount,
    ) === images.length || hasNoNfts
  const showLoading = useDelayedLoading(finishedLoading, 1000)

  return (
    <>
      {hasNoNfts && (
        <Center
          direction="column"
          style={{ margin: "64px", textAlign: "center" }}
        >
          <NotFoundText>You do not own any displayable NFTs</NotFoundText>
        </Center>
      )}
      <PreloadContainer>
        <GridWrapper gap={gap} columns={columnsCount} width={widthContainer}>
          <Column gap={gap}>
            {images.map((x, i) => {
              return (
                <ImageFrame
                  key={"preload-" + x.id}
                  url={x.url}
                  border={`${border}px`}
                  onError={() => setErrorCount((x) => ++x)}
                  onDimensionsKnown={(h) => {
                    setDimensionsDebounced((all) => ({ ...all, [x.id]: h }))
                  }}
                  onDimensionsChange={(h) => {
                    setDimensionsDebounced((all) => ({ ...all, [x.id]: h }))
                  }}
                />
              )
            })}
          </Column>
        </GridWrapper>
      </PreloadContainer>
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
                        url={item.url}
                        border={`${border}px`}
                        clickable
                        onClick={() => {
                          onImageClick?.(id, item.assetContractAddress)
                        }}
                      />
                    )
                  })}
              </Column>
            )
          })}
        </GridWrapper>
      )}
      {showLoading && <LoadingStrip />}
    </>
  )
}

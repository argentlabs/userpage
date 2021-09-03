import { useWindowResize } from "beautiful-react-hooks"
import { CSSProperties, FC, useMemo, useRef, useState } from "react"
import styled, { keyframes } from "styled-components"
import { ifProp, prop, theme, withProp } from "styled-tools"

import Center from "../../components/Center"
import { useDebounceUpdate } from "../../hooks/useDebounceUpdate"
import { useDelayedLoading } from "../../hooks/useDelayedLoading"
import { centerMixin, shadowMixin } from "../../mixins.style"

export const IconBar = styled(Center)`
  margin-top: -30px;
  z-index: 1;
  p {
    font-size: 14px;
  }
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

export const OpenseaWrapper = styled.div`
  ${centerMixin}
  flex-direction: row;
  animation: ${WaitAndShowAnimation} 5s ease-in-out;
`

const ImageWrapper = styled.div<{
  border: string
  clickable?: boolean
}>`
  width: calc(100% - 2 * ${withProp("border", (x) => x)});
  border-radius: 8px;
  padding: ${prop<any>("border")};
  animation: ${keyframes`
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  `} 400ms ease-in-out;
  background-color: ${theme("colors.bg", "white")};
  cursor: ${ifProp("clickable", "pointer", "inherit")};

  ${shadowMixin}
  ${centerMixin}
`

export interface Dimensions {
  domHeight: number
  domWidth: number
  realHeight: number
  realWidth: number
}

export const ImageFrame: FC<{
  url: string
  border: string
  height?: number
  width?: number
  clickable?: boolean
  maxHeight?: string
  onDimensionsKnown?: (dimensions: Dimensions) => void
  onDimensionsChange?: (dimensions: Dimensions) => void
  style?: CSSProperties
  onClick?: () => void
  onError?: () => void
}> = ({
  url,
  onDimensionsKnown,
  onDimensionsChange,
  onClick,
  onError,
  border,
  height,
  width,
  maxHeight = "1000px",
  clickable = false,
  style,
  ...props
}) => {
  const ref = useRef<HTMLVideoElement & HTMLImageElement>(null)
  useWindowResize(() => {
    if (ref.current?.offsetHeight) {
      onDimensionsChange?.({
        domHeight: ref.current.offsetHeight,
        domWidth: ref.current.offsetWidth,
        realHeight: ref.current.height,
        realWidth: ref.current.offsetWidth,
      })
    }
  })
  return (
    <ImageWrapper
      clickable={clickable}
      style={style}
      border={border}
      onClick={() => onClick?.()}
    >
      {url.endsWith(".mp4") ? (
        <video
          autoPlay
          muted
          loop
          preload="auto"
          ref={ref}
          src={url}
          onError={onError}
          onCanPlay={(img) => {
            if (img?.currentTarget?.offsetHeight) {
              onDimensionsKnown?.({
                domHeight: img.currentTarget.offsetHeight,
                domWidth: img.currentTarget.offsetWidth,
                realHeight: img.currentTarget.height,
                realWidth: img.currentTarget.offsetWidth,
              })
            }
          }}
          style={{
            maxWidth: `100%`,
            maxHeight,
            height: `${height}px` || "auto",
            width: `${width}px` || "auto",
          }}
          {...props}
        />
      ) : (
        <img
          alt=""
          src={url}
          ref={ref}
          onError={onError}
          onLoad={(img) => {
            if (img?.currentTarget?.offsetHeight) {
              onDimensionsKnown?.({
                domHeight: img.currentTarget.offsetHeight,
                domWidth: img.currentTarget.offsetWidth,
                realHeight: img.currentTarget.height,
                realWidth: img.currentTarget.offsetWidth,
              })
            }
          }}
          style={{
            maxWidth: `100%`,
            maxHeight,
            height: `${height}px` || "auto",
            width: `${width}px` || "auto",
          }}
          {...props}
        />
      )}
    </ImageWrapper>
  )
}

export const GridBase = styled.div<{
  height: number
  gap: number
  columns: number
}>`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: ${({ columns, gap }) =>
    `calc(${100 / columns}% - ${((columns - 1) * gap) / columns}px)`};
  align-self: flex-start;
  gap: ${prop<any>("gap")}px;
  max-height: ${prop<any>("height", "0")}px;
`
const GridBaseWrapper = styled.div<{
  columns: number
  width?: string
}>`
  margin: 100px 0;
  width: ${prop<any>("width", "calc(100% - 512px)")};
`

export type ImageProp = {
  url: string
  id: string
  assetContractAddress: string
}

const NotFoundText = styled.h3`
  font-weight: bold;
  animation: ${WaitAndShowAnimation} 5s ease-in-out;
`

export const Grid: FC<{
  images: ImageProp[]
  onImageClick?: (tokenId: string, assetContractAddress: string) => void
}> = ({ images, onImageClick }) => {
  const [width, setWidth] = useState(window.innerWidth)
  useWindowResize(() => {
    setWidth(window.innerWidth)
  })
  const rowsCount = useMemo(
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
        : "calc(100% - 32px)",
    [width],
  )

  const [allHeight, setAllHeight] = useState<{ [i: string]: number }>({})

  const setHeightProxy = useDebounceUpdate(setAllHeight, [100, 500, 1000])

  const [prevColumns, setPrevColumns] = useState(
    new Array(rowsCount).fill({ acc: 0, items: [] }) as Array<{
      acc: number
      items: {
        [key: string]: { position?: number; height: number }
      }
    }>,
  )
  const columns = useMemo(() => {
    const re = Object.entries(allHeight).reduce((acc, [k, v]) => {
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
              height: v,
              position: Object.keys(output[tinyestIndex].items).length,
            },
          },
        })
      } else if (existingItem.height !== v) {
        const existingItemColIndex = output.findIndex((x) => !!x.items[k])

        const newItems = {
          ...output[existingItemColIndex].items,
          [k]: {
            ...existingItem,
            height: v,
          },
        }

        output.splice(existingItemColIndex, 1, {
          ...output[existingItemColIndex],
          items: newItems,
        })
      }

      return output.map((col) => ({
        ...col,
        acc: Object.values(col.items).reduce((a, v) => {
          return a + v.height + 2 * border + gap
        }, 0),
      }))
    }, prevColumns)
    setPrevColumns(re)
    return re
  }, [allHeight, rowsCount, border, gap])

  const highestColumnHeight = useMemo(() => {
    return Math.max(...columns.map((x) => x.acc))
  }, [columns])

  const flatColumns = useMemo(
    () =>
      columns
        .map((x, i) => {
          const re = Object.entries(x.items)
          const loaderHeight = highestColumnHeight - x.acc
          if (loaderHeight) {
            re.push([`loading-c${i}`, { height: loaderHeight }])
          }
          return re
        })
        .map((x) =>
          x.sort(
            ([, v1], [, v2]) =>
              (v1.position ?? Infinity) - (v2.position ?? Infinity),
          ),
        )
        .flat(),
    [columns],
  )

  const sortedImages = useMemo(() => {
    return flatColumns.map(([k, v]) => ({
      id: k,
      url: images.find((x) => x.id === k)?.url || "placeholder",
      height: v.height,
    }))
  }, [flatColumns])

  const hasNoNfts = images.length === 0
  const finishedLoading =
    sortedImages.length - 2 + errorCount === images.length || hasNoNfts
  const isLoading = useDelayedLoading(finishedLoading, 1000)

  return (
    <GridBaseWrapper width={widthContainer} columns={rowsCount}>
      <div
        style={{
          position: "absolute",
          top: "-99000",
          opacity: 0,
          zIndex: -100,
          width: "100vw",
        }}
      >
        <GridBaseWrapper width={widthContainer} columns={rowsCount}>
          <GridBase columns={rowsCount} height={highestColumnHeight} gap={gap}>
            {images.map((x, i) => {
              return (
                <ImageFrame
                  key={"preload-" + x.id}
                  url={x.url}
                  border={`${border}px`}
                  onError={() => setErrorCount((x) => ++x)}
                  onDimensionsKnown={(h) => {
                    setHeightProxy((all) => ({ ...all, [x.id]: h.domHeight }))
                  }}
                  onDimensionsChange={(h) => {
                    setHeightProxy((all) => ({ ...all, [x.id]: h.domHeight }))
                  }}
                />
              )
            })}
          </GridBase>
        </GridBaseWrapper>
      </div>

      <GridBase columns={rowsCount} height={highestColumnHeight} gap={gap}>
        {sortedImages.map((x, i) => {
          if (x.url === "placeholder") {
            return (
              <div
                key={x.id}
                style={{
                  height: x.height,
                  width: "100%",
                }}
              ></div>
            )
          }

          return (
            <ImageFrame
              key={x.id}
              height={x.height}
              url={x.url}
              border={`${border}px`}
              clickable
              onClick={() => {
                onImageClick?.(
                  x.id,
                  images.find((i) => i.id === x.id)!.assetContractAddress,
                )
              }}
            />
          )
        })}
      </GridBase>
      {isLoading && <LoadingStrip />}
      {hasNoNfts && (
        <Center direction="column">
          <NotFoundText>You do not own any displayable NFTs</NotFoundText>
        </Center>
      )}
    </GridBaseWrapper>
  )
}

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

export const Block = styled.div<{ ar: string; index: number }>`
  width: 100%;
  aspect-ratio: ${prop<any>("ar")};
  background: url("https://source.unsplash.com/random?${prop<any>("index")}");
  background-size: cover;
  border-radius: 5px;
  color: white;
  display: flex;
  font-size: 30px;
  align-items: center;
  justify-content: center;
`

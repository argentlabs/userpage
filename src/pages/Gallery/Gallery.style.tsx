import { useWindowResize } from "beautiful-react-hooks"
import { SetStateAction, useMemo } from "react"
import { useState } from "react"
import { useRef } from "react"
import { useEffect } from "react"
import { FC } from "react"
import styled, { keyframes } from "styled-components"
import { prop, theme, withProp } from "styled-tools"

import Center from "../../components/Center"
import { centerMixin } from "../../mixins.style"

export const IconBar = styled(Center)`
  margin-top: -30px;
  z-index: 1;
  p {
    font-size: 14px;
  }
`

const showAnimation = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

const ImageWrapper = styled.div<{
  border: number
}>`
  width: calc(100% - ${withProp("border", (x) => `${2 * x}px`)});
  border-radius: 8px;
  padding: ${prop<any>("border")}px;
  animation: ${showAnimation} 400ms ease-in-out;
  background-color: ${theme("colors.bg", "white")};
  box-shadow: 0 4px 8px 0 ${theme("colors.fg20", "rgba(0, 0, 0, 0.2)")};
  cursor: pointer;

  ${centerMixin}
`

export const ImageFrame: FC<{
  url: string
  border: number
  index: number
  height?: number
  onHeightKnown?: (height: number) => void
  onHeightChanged?: (height: number) => void
  onClick?: () => void
}> = ({
  url,
  onHeightKnown,
  onHeightChanged,
  onClick,
  border,
  height,
  index,
  ...props
}) => {
  const ref = useRef<HTMLVideoElement & HTMLImageElement>(null)
  useWindowResize(() => {
    if (ref.current?.offsetHeight) {
      onHeightChanged?.(ref.current?.offsetHeight)
    }
  })
  return (
    <ImageWrapper border={border} onClick={() => onClick?.()}>
      {url.endsWith(".mp4") ? (
        <video
          autoPlay
          muted
          loop
          preload="auto"
          ref={ref}
          src={url}
          onCanPlay={(img) => {
            if (img?.currentTarget?.offsetHeight) {
              onHeightKnown?.(img.currentTarget.offsetHeight)
            }
          }}
          style={{
            maxWidth: `100%`,
            maxHeight: 1000,
            height: `${height}px` || "auto",
          }}
          {...props}
        />
      ) : (
        <img
          alt=""
          src={url}
          ref={ref}
          onLoad={(img) => {
            if (img?.currentTarget?.offsetHeight) {
              onHeightKnown?.(img.currentTarget.offsetHeight)
            }
          }}
          style={{
            maxWidth: `100%`,
            maxHeight: 1000,
            height: `${height}px` || "auto",
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

const useDebounceUpdate = <T extends any>(
  updateFn: React.Dispatch<SetStateAction<T>>,
  delayMs: number[] = [250],
): React.Dispatch<SetStateAction<T>> => {
  const updates = useRef<SetStateAction<T>[]>([])
  const timeoutPid = useRef(0)
  const run = useRef(0)

  useEffect(() => {
    return () => {
      clearTimeout(timeoutPid.current)
    }
  }, [])

  const delayForRun = useMemo(() => {
    return delayMs[run.current] ?? delayMs[delayMs.length - 1]
  }, [delayMs, run.current])

  return (s) => {
    updates.current.push(s)
    if (!timeoutPid.current) {
      timeoutPid.current = setTimeout(() => {
        console.log("DISPATCH")
        timeoutPid.current = 0
        run.current++
        updates.current.map(updateFn)
        updates.current = []
      }, delayForRun) as unknown as number
    }
  }
}

export const Grid: FC<{
  images: ImageProp[]
  onImageClick?: (tokenId: string, assetContractAddress: string) => void
}> = ({ images, onImageClick }) => {
  const [width, setWidth] = useState(window.innerWidth)
  useWindowResize(() => {
    setWidth(window.innerWidth)
  })
  const rowsCount = useMemo(
    () => (width > 720 ? 3 : width > 380 ? 2 : 1),
    [width],
  )

  const gap = useMemo(() => (rowsCount > 2 ? 32 : 16), [rowsCount])
  const border = useMemo(() => (width > 1024 ? 32 : 16), [width])
  const widthContainer = useMemo(
    () => (rowsCount > 2 ? "calc(100% - 40vw)" : "calc(100% - 32px)"),
    [rowsCount],
  )

  const [allHeight, setAllHeight] = useState<{ [i: string]: number }>({})

  const setHeightProxy = useDebounceUpdate(setAllHeight, [500, 1000])

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

  const isLoading = sortedImages.length - 2 !== images.length

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
                  index={i}
                  key={"preload-" + x.id}
                  url={x.url}
                  border={border}
                  onHeightKnown={(h) => {
                    setHeightProxy((all) => ({ ...all, [x.id]: h }))
                  }}
                  onHeightChanged={(h) => {
                    setHeightProxy((all) => ({ ...all, [x.id]: h }))
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
              index={i}
              key={x.id}
              height={x.height}
              url={x.url}
              border={border}
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

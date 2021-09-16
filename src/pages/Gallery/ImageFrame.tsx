import { useWindowResize } from "beautiful-react-hooks"
import { FC, useRef } from "react"
import styled, { CSSProperties, keyframes } from "styled-components"
import { ifProp, prop, theme } from "styled-tools"

import { shadowMixin } from "../../mixins.style"

const ImageWrapper = styled.div<{
  border: string
  clickable?: boolean
}>`
  width: 100%;
  border-radius: 8px;
  padding: ${prop("border")};
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
`

export interface Dimensions {
  domHeight: number
  domWidth: number
  realHeight: number
  realWidth: number
}

const isVideoSrc = (url: string): boolean =>
  [".mp4"].some((ext) => url.endsWith(ext))

export const ImageFrame: FC<{
  url: string
  border: string
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
      {isVideoSrc(url) ? (
        <video
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
          ref={ref}
          src={url}
          onError={onError}
          onCanPlayThrough={(img) => {
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
            boxSizing: "border-box",
            maxHeight,
            width: "100%",
            display: "block",
            margin: "auto",
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
            boxSizing: "border-box",
            maxHeight,
            width: "100%",
            display: "block",
            margin: "auto",
          }}
          {...props}
        />
      )}
    </ImageWrapper>
  )
}

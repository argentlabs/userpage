import { usePreviousValue, useWindowResize } from "beautiful-react-hooks"
import { FC, useRef } from "react"
import styled, { CSSProperties, keyframes } from "styled-components"
import { ifProp, prop, theme } from "styled-tools"

import { SupportedNfts } from "../../libs/nft"
import { shadowMixin } from "../../mixins.style"
import NftModelViewer from "./ModelViewer"

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

const CollectionDetails = styled.div<{ show: boolean }>`
  transition: all 400ms ease-in-out,
    ${ifProp(
      "show",
      "opacity 100ms ease-in-out 300ms",
      "opacity 100ms ease-in-out 0ms",
    )};

  opacity: ${ifProp("show", "1", "0")};
  max-height: ${ifProp("show", "96px", "0px")};
  padding-top: ${ifProp("show", "16px", "0px")};

  overflow: hidden;
  > h3 {
    font-weight: 600;
    font-size: 24px;
  }
  > p {
    margin-top: 1em;
    font-weight: 600;
    color: #8f8e8c;
    font-size: 14px;
  }
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
  type: SupportedNfts
  clickable?: boolean
  poster?: string
  onDimensionsKnown?: (dimensions: Dimensions) => void
  onDimensionsChange?: (dimensions: Dimensions) => void
  style?: CSSProperties
  onClick?: () => void
  onError?: () => void
  details?: {
    collectionName: string
    collectionSlug: string
    collectionAmount: number
  }
}> = ({
  url,
  type,
  onDimensionsKnown,
  onDimensionsChange,
  onClick,
  onError,
  border,
  clickable = false,
  style,
  details,
  poster,
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

  const prevDetails = usePreviousValue(details)

  return (
    <ImageWrapper
      clickable={clickable}
      style={style}
      border={border}
      onClick={() => onClick?.()}
    >
      {type === "video" ? (
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
            maxWidth: "100%",
            maxHeight: "100%",
            boxSizing: "border-box",
            display: "block",
            margin: "auto",
          }}
          {...props}
        />
      ) : type === "audio" ? (
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            flexDirection: "column",
          }}
        >
          {poster && (
            <img
              alt=""
              src={poster}
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
                maxWidth: "100%",
                maxHeight: "100%",
                boxSizing: "border-box",
                display: "block",
                margin: "auto",
              }}
              {...props}
            />
          )}
          <audio
            controls
            style={{
              maxWidth: "100%",
              width: "100%",
              boxSizing: "border-box",
              display: "block",
              margin: "auto",
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "8px",
              filter: "drop-shadow(0px 0px 8px rgba(0,0,0,0.5))",
            }}
            onClick={(e) => {
              e.stopPropagation()
            }}
            onLoadedData={(img) => {
              if (img?.currentTarget?.offsetHeight && !poster) {
                onDimensionsKnown?.({
                  domHeight: img.currentTarget.offsetHeight,
                  domWidth: img.currentTarget.offsetWidth,
                  realHeight: 50,
                  realWidth: 200,
                })
              }
            }}
          >
            <source src={url} />
          </audio>
        </div>
      ) : type === "model" ? (
        <NftModelViewer
          src={url}
          size={style?.height === "100%" ? "400px" : undefined}
          onLoad={() =>
            onDimensionsKnown?.({
              domHeight: 400,
              domWidth: 400,
              realHeight: 400,
              realWidth: 400,
            })
          }
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
            maxWidth: "100%",
            maxHeight: "100%",
            boxSizing: "border-box",
            display: "block",
            margin: "auto",
          }}
          {...props}
        />
      )}

      <CollectionDetails show={Boolean(details)}>
        <>
          <h3>{(details || prevDetails)?.collectionName}</h3>
          <p>
            {" "}
            {(details || prevDetails)?.collectionAmount}{" "}
            {(details || prevDetails)?.collectionAmount === 1 ? "NFT" : "NFTs"}
          </p>
        </>
      </CollectionDetails>
    </ImageWrapper>
  )
}

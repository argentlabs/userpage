import { useState } from "react"
import { FC } from "react"
import styled from "styled-components"
import { prop, theme } from "styled-tools"

import Center from "../../components/Center"
import IconButton from "../../components/IconButton"
import Loading from "../../components/Loading"
import CaretLeft from "../../components/Svgs/CaretLeft"
import CloseFullscreen from "../../components/Svgs/CloseFullscreen"
import Fullscreen from "../../components/Svgs/Fullscreen"
import Info from "../../components/Svgs/Info"
import Moon from "../../components/Svgs/Moon"
import Play from "../../components/Svgs/Play"
import Sun from "../../components/Svgs/Sun"

const BigDisplayWrapper = styled.div`
  height: 75vh;
  width: 75vw;
`

const BigDisplayImg = styled.img<{ borderWidth: string }>`
  width: 100%;
  height: 100%;
  object-fit: contain;

  filter: drop-shadow(
      0 -${prop<any>("borderWidth")} 0 ${theme("colors.bg", "white")}
    )
    drop-shadow(0 ${prop<any>("borderWidth")} 0 ${theme("colors.bg", "white")})
    drop-shadow(-${prop<any>("borderWidth")} 0 0 ${theme("colors.bg", "white")})
    drop-shadow(${prop<any>("borderWidth")} 0 0 ${theme("colors.bg", "white")})
    drop-shadow(0 8px 80px ${theme("colors.fg20", "rgba(0,0,0,.2)")});
`

function getProps(isVideo: boolean, onLoad: () => void) {
  return isVideo
    ? {
        autoPlay: true,
        muted: true,
        loop: true,
        onCanPlayThrough: onLoad,
      }
    : {
        onLoad,
      }
}

export const BigNftDisplay: FC<{ src: string }> = (props) => {
  const isVideo = props.src.endsWith(".mp4")
  const [loaded, setLoaded] = useState(false)

  return (
    <BigDisplayWrapper>
      {!loaded && (
        <Center style={{ height: "100%", width: "100%" }}>
          <Loading />
        </Center>
      )}
      <BigDisplayImg
        borderWidth="5vh"
        as={isVideo ? "video" : undefined}
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 500ms ease-in-out",
        }}
        {...getProps(isVideo, () => {
          setLoaded(true)
        })}
        {...props}
      />
    </BigDisplayWrapper>
  )
}

export const GoBackButton = styled(IconButton).attrs(
  ({
    theme: {
      colors: { iconBg },
    },
  }) => ({
    Icon: <CaretLeft />,
    bgColor: iconBg,
    size: 32,
    mobileSize: 28,
    svgSize: 16,
    mobileSvgSize: 14,
    "aria-label": "Go back",
  }),
)``

export const InfoButton = styled(IconButton).attrs(
  ({
    theme: {
      colors: { iconBg },
    },
  }) => ({
    Icon: <Info />,
    bgColor: iconBg,
    size: 32,
    mobileSize: 28,
    svgSize: 16,
    target: "_blank",
    mobileSvgSize: 14,
    "aria-label": "Additional Info",
  }),
)``

export const SunButton = styled(IconButton).attrs(
  ({
    theme: {
      colors: { iconBg },
    },
  }) => ({
    Icon: <Sun />,
    bgColor: iconBg,
    size: 32,
    mobileSize: 28,
    svgSize: 16,
    mobileSvgSize: 14,
    "aria-label": "Toggle Darkmode",
  }),
)``

export const MoonButton = styled(IconButton).attrs(
  ({
    theme: {
      colors: { iconBg },
    },
  }) => ({
    Icon: <Moon />,
    bgColor: iconBg,
    size: 32,
    mobileSize: 28,
    svgSize: 16,
    mobileSvgSize: 14,
    "aria-label": "Toggle Darkmode",
  }),
)``

export const FullscreenButton = styled(IconButton).attrs(
  ({
    theme: {
      colors: { iconBg },
    },
  }) => ({
    Icon: <Fullscreen />,
    bgColor: iconBg,
    size: 32,
    mobileSize: 28,
    svgSize: 16,
    mobileSvgSize: 14,
    "aria-label": "Enter fullscreen",
  }),
)``

export const CloseFullscreenButton = styled(IconButton).attrs(
  ({
    theme: {
      colors: { iconBg },
    },
  }) => ({
    Icon: <CloseFullscreen />,
    bgColor: iconBg,
    size: 32,
    mobileSize: 28,
    svgSize: 16,
    mobileSvgSize: 14,
    "aria-label": "Close fullscreen",
  }),
)``

export const PlayButton = styled(IconButton).attrs(
  ({
    theme: {
      colors: { iconBg },
    },
  }) => ({
    Icon: <Play />,
    bgColor: iconBg,
    size: 32,
    mobileSize: 28,
    svgSize: 16,
    mobileSvgSize: 14,
    "aria-label": "Play",
  }),
)``

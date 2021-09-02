import { useState } from "react"
// import Tilt from "react-parallax-tilt"
import styled, { withTheme } from "styled-components"

import Center from "../../components/Center"
import IconButton from "../../components/IconButton"
import { DelayedLoading as Loading } from "../../components/Loading"
import CaretLeft from "../../components/Svgs/CaretLeft"
import CloseFullscreen from "../../components/Svgs/CloseFullscreen"
import Fullscreen from "../../components/Svgs/Fullscreen"
import Info from "../../components/Svgs/Info"
import Moon from "../../components/Svgs/Moon"
import Play from "../../components/Svgs/Play"
import Sun from "../../components/Svgs/Sun"
import { centerMixin } from "../../mixins.style"
import { Theme } from "../../themes/theme"
import { Dimensions, ImageFrame } from "../Gallery/Gallery.style"

const BigDisplayWrapper = styled.div`
  height: 75vh;
  width: 75vw;

  ${centerMixin}
`

export const BigNftDisplay = withTheme(
  ({ src, theme }: { src: string; theme: Theme }) => {
    const [dimensions, setDimensions] = useState<Dimensions>()

    return (
      <BigDisplayWrapper>
        {!dimensions && (
          <Center
            style={{
              position: "absolute",
              top: 0,
              height: "60vh",
              width: "100%",
              zIndex: -1,
            }}
          >
            <Loading />
          </Center>
        )}
        {/* <Tilt gyroscope={true} tiltMaxAngleX={10} tiltMaxAngleY={10}> */}
        <ImageFrame
          onDimensionsKnown={setDimensions}
          onDimensionsChange={setDimensions}
          border="min(6vh, 6vw)"
          url={src}
          maxHeight="60vh"
          style={{
            opacity: dimensions ? 1 : 0,
            ...(!dimensions && { transform: "translateY(-200vh)" }),
            transition: "opacity 300ms ease-in-out",
            width: "auto",
            backgroundColor: theme.colors.nftDetailFrame,
          }}
        />
        {/* </Tilt> */}
      </BigDisplayWrapper>
    )
  },
)

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

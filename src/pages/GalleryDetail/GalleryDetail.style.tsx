import { useState } from "react"
import { FC } from "react"
import styled from "styled-components"
import { prop } from "styled-tools"

import Center from "../../components/Center"
import IconButton from "../../components/IconButton"
import Loading from "../../components/Loading"
import CaretLeft from "../../components/Svgs/CaretLeft"
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

  filter: drop-shadow(0 -${prop("borderWidth")} 0 white)
    drop-shadow(0 ${prop("borderWidth")} 0 white)
    drop-shadow(-${prop("borderWidth")} 0 0 white)
    drop-shadow(${prop("borderWidth")} 0 0 white);
`

function getProps<T extends boolean>(isVideo: T, onLoad: () => void) {
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

export const GoBackButton = styled(IconButton).attrs({
  Icon: <CaretLeft />,
  bgColor: "#C2C0BE",
  size: 32,
  mobileSize: 28,
  svgSize: 16,
  mobileSvgSize: 14,
  "aria-label": "Go back",
})``

export const InfoButton = styled(IconButton).attrs({
  Icon: <Info />,
  bgColor: "#C2C0BE",
  size: 32,
  mobileSize: 28,
  svgSize: 16,
  mobileSvgSize: 14,
  "aria-label": "Go back",
})``

export const SunButton = styled(IconButton).attrs({
  Icon: <Sun />,
  bgColor: "#C2C0BE",
  size: 32,
  mobileSize: 28,
  svgSize: 16,
  mobileSvgSize: 14,
  "aria-label": "Go back",
})``

export const MoonButton = styled(IconButton).attrs({
  Icon: <Moon />,
  bgColor: "#C2C0BE",
  size: 32,
  mobileSize: 28,
  svgSize: 16,
  mobileSvgSize: 14,
  "aria-label": "Go back",
})``

export const FullscreenButton = styled(IconButton).attrs({
  Icon: <Fullscreen />,
  bgColor: "#C2C0BE",
  size: 32,
  mobileSize: 28,
  svgSize: 16,
  mobileSvgSize: 14,
  "aria-label": "Go back",
})``

export const PlayButton = styled(IconButton).attrs({
  Icon: <Play />,
  bgColor: "#C2C0BE",
  size: 32,
  mobileSize: 28,
  svgSize: 16,
  mobileSvgSize: 14,
  "aria-label": "Go back",
})``

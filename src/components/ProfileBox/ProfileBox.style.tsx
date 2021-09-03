import styled from "styled-components"
import { ifProp, prop, theme } from "styled-tools"

import { centerMixin } from "../../mixins.style"
import IconButton from "../IconButton"
import CaretLeft from "../Svgs/CaretLeft"

export interface BoxProps {
  lean?: boolean
  pt?: string
}

export const Box = styled.div<BoxProps>`
  width: calc(100vw - 32px);
  padding-top: ${prop<any>("pt", "100px")};
  padding-bottom: ${ifProp("lean", "64px", "84px")};
  position: relative;
  border-radius: 32px;

  @media only screen and (min-width: 480px) {
    max-width: calc(100vw - 64px);
    width: auto;
    border-radius: 48px;
    min-width: 480px;
  }

  @media only screen and (min-height: 600px) {
    padding-top: ${prop<any>("pt", "128px")};
    padding-bottom: ${ifProp("lean", "64px", "111px")};
  }

  background: ${theme("colors.bg", "white")};
  box-shadow: 0px 4px 40px rgba(0, 0, 0, 0.04);

  ${centerMixin}

  h1 + h2 {
    margin-top: 16px;
  }

  h1,
  h2 {
    max-width: calc(100% - 32px);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`

export const H1 = styled.h1<{ tiny?: boolean }>`
  font-weight: bold;
  font-size: ${ifProp("tiny", "24px", "32px")};
`

export const H2 = styled.h2`
  font-size: 16px;
`

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
)`
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 1;
  @media only screen and (min-width: 480px) {
    top: 32px;
    left: 32px;
  }
`

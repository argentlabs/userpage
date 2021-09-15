import styled from "styled-components"
import { ifProp, prop, theme } from "styled-tools"

import { centerMixin, shadowMixin } from "../../mixins.style"
import IconButton from "../IconButton"
import CaretLeft from "../Svgs/CaretLeft"

export interface BoxProps {
  lean?: boolean
  pt?: string
}

export const Box = styled.div<BoxProps>`
  box-sizing: border-box;
  width: calc(100vw - 48px);
  padding: ${prop<any>("pt", "100px")} 24px ${ifProp("lean", "64px", "84px")};
  position: relative;
  border-radius: 32px;

  @media only screen and (min-width: 480px) {
    max-width: calc(100vw - 64px);
    width: auto;
    border-radius: 48px;
    min-width: 480px;
    padding: ${prop<any>("pt", "100px")} 16px ${ifProp("lean", "64px", "84px")};
  }

  @media only screen and (min-height: 600px) {
    padding-top: ${prop<any>("pt", "128px")};
    padding-bottom: ${ifProp("lean", "64px", "111px")};
  }

  background: ${theme("colors.bg", "white")};
  ${shadowMixin}

  ${centerMixin}

  h1 + h2 {
    margin-top: 16px;
  }

  h1,
  h2 {
    max-width: 100%;
    overflow-x: hidden;
    line-height: 1.3em;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`

export const H1 = styled.h1<{ tiny?: boolean }>`
  font-weight: bold;
  line-height: 1.3em;
  font-size: 24px;

  @media only screen and (min-width: 480px) {
    font-size: 32px;
  }
`

export const H2 = styled.h2`
  line-height: 1.3em;
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

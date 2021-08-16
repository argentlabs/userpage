import styled from "styled-components"
import { ifProp } from "styled-tools"

import { centerMixin } from "../../mixins.style"
import IconButton from "../IconButton"
import CaretLeft from "../Svgs/CaretLeft"

export const Box = styled.div<{ lean?: boolean }>`
  min-width: calc(100vw - 10px);
  padding-top: 128px;
  padding-bottom: ${ifProp("lean", "64px", "111px")};
  position: relative;

  @media only screen and (min-width: 480px) {
    min-width: 480px;
  }

  background: #ffffff;
  box-shadow: 0px 4px 40px rgba(0, 0, 0, 0.04);
  border-radius: 48px;

  margin-top: -120px;

  ${centerMixin}

  h1 + h2 {
    margin-top: 16px;
  }
`

export const H1 = styled.h1<{ tiny?: boolean }>`
  font-weight: bold;
  font-size: ${ifProp("tiny", "24px", "32px")};
  color: #333332;
`

export const H2 = styled.h2`
  font-size: 16px;
  color: #333332;
`

export const GoBackButton = styled(IconButton).attrs({
  Icon: <CaretLeft />,
  bgColor: "#C2C0BE",
  size: 32,
  mobileSize: 28,
  svgSize: 16,
  mobileSvgSize: 14,
  "aria-label": "Go back",
})`
  position: absolute;
  top: 32px;
  left: 32px;
  z-index: 1;
`

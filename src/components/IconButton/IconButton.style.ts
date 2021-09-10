import styled, { css } from "styled-components"
import { prop, theme } from "styled-tools"

import { centerMixin } from "../../mixins.style"

export interface CircleProps {
  size?: number
  svgSize?: number
  mobileSize?: number
  mobileSvgSize?: number
  bgColor?: string
  border?: string
}

export const Circle = styled.span<CircleProps>`
  height: ${prop<any>("mobileSize", "64")}px;
  width: ${prop<any>("mobileSize", "64")}px;
  color: white;

  ${centerMixin}

  border-radius: 50%;
  background-color: ${prop<any>("bgColor", "#ff875b")};
  border: ${prop<any>("border", css`5px solid ${theme("colors.bg", "white")}`)};

  > svg {
    max-width: ${prop<any>("mobileSvgSize", "28")}px;
    max-height: ${prop<any>("mobileSvgSize", "28")}px;
  }

  @media only screen and (min-width: 480px) {
    height: ${prop<any>("size", "80")}px;
    width: ${prop<any>("size", "80")}px;
    > svg {
      max-width: ${prop<any>("svgSize", "36")}px;
      max-height: ${prop<any>("svgSize", "36")}px;
    }
  }
`

export const Clickable = styled.a`
  ${centerMixin}
  cursor: pointer;
  text-decoration: none;

  > p {
    margin-top: 5px;
  }
`

export const Text = styled.p`
  color: #5c5b59;
  font-size: 16px;
`

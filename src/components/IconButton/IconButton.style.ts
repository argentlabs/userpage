import styled from "styled-components"
import { prop } from "styled-tools"

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
  height: ${prop("mobileSize", "64")}px;
  width: ${prop("mobileSize", "64")}px;

  ${centerMixin}

  border-radius: 50%;
  background-color: ${prop("bgColor", "#ff875b")};
  border: ${prop("border", "5px solid white")};

  > svg {
    max-width: ${prop("mobileSvgSize", "28")}px;
    max-height: ${prop("mobileSvgSize", "28")}px;
  }

  @media only screen and (min-width: 480px) {
    height: ${prop("size", "80")}px;
    width: ${prop("size", "80")}px;
    > svg {
      max-width: ${prop("svgSize", "36")}px;
      max-height: ${prop("svgSize", "36")}px;
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

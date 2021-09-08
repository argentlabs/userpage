import styled, { keyframes } from "styled-components"
import { prop } from "styled-tools"

export const AddressBase = styled.p`
  position: relative;
  display: block;
  text-align: center;
  max-width: 220px;
  line-height: 1.3em;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
`

const ConfirmationAnimation = keyframes`
    0% {
        opacity: 0;
        transform: translate(-50%, 0) scale(50%);
    }
    60% {
        opacity: 1;
    }
    80% {
        opacity: 1;
    }
    100% {
        opacity: 0;
        transform: translate(-50%, -120%) scale(100%);
    }
`

interface ConfirmationIndicatorProps {
  x: number
  y: number
}
export const ConfirmationIndicator = styled.span<ConfirmationIndicatorProps>`
  position: absolute;
  display: block;
  top: ${prop("y")}px;
  left: ${prop("x")}px;
  height: 1.6em;
  width: 1.6em;
  font-size: 1.6em;
  animation: ${ConfirmationAnimation} 800ms ease-out forwards;
`

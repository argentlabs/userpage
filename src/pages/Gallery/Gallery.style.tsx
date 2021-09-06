import styled, { keyframes } from "styled-components"

import Center from "../../components/Center"
import { centerMixin } from "../../mixins.style"

export const IconBar = styled(Center)`
  margin-top: -30px;
  z-index: 1;
  p {
    font-size: 14px;
  }
`

const WaitAndShowAnimation = keyframes`
  0% {
    opacity: 0;
  }
  90% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

export const OpenseaWrapper = styled.div`
  ${centerMixin}
  flex-direction: row;
  animation: ${WaitAndShowAnimation} 5s ease-in-out;
`

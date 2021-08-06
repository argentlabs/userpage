import Lottie from "lottie-react"
import styled from "styled-components"

import Center from "../../components/Center"

export const ButtonWrapper = styled(Center)`
  margin-top: 63px;

  * + * {
    margin-top: 17px;
  }
`

export const InputWrapper = styled(Center)`
  > select {
    margin: 48px 0 24px;
  }
`

export const EtherscanLink = styled.a`
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  color: #0078a4;
`

export const SLottie = styled(Lottie)`
  max-width: 130px;
  max-height: 130px;
  margin: 8px;
`

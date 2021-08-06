import Lottie from "lottie-react"
import styled from "styled-components"
import { ifProp } from "styled-tools"

import Center from "../../components/Center"
import { centerMixin } from "../../mixins.style"

export const ButtonWrapper = styled(Center)`
  margin-top: 63px;

  * + * {
    margin-top: 17px;
  }

  p {
    margin-top: 32px;
  }
`

export const InputWrapper = styled(Center)`
  > select {
    margin: 16px 0 24px;
  }
  > p {
    margin-top: 32px;
  }
`

export const ExternalLink = styled.a`
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

export const LottieWrapper = styled.div`
  ${centerMixin}

  > a:last-child,button:last-child {
    margin-top: 32px;
  }
`

export const MetaText = styled.p<{ invisible?: boolean }>`
  color: ${ifProp("invisible", "transparent", "#8F8E8C")};
  user-select: ${ifProp("invisible", "none", "auto")};
  font-size: 14px;
  text-align: center;
`

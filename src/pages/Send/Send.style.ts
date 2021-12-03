import Lottie from "lottie-react"
import styled from "styled-components"
import { ifProp } from "styled-tools"

import { SecondaryButton } from "../../components/Button"
import Center from "../../components/Center"
import { SelectInputWrapper } from "../../components/SelectInput/SelectInput.style"
import { centerMixin, shadowMixin } from "../../mixins.style"

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
  > ${SelectInputWrapper} {
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

  > ${SecondaryButton} {
    margin-top: 32px;
  }
`

export const MetaText = styled.p<{ invisible?: boolean; red?: boolean }>`
  color: ${({ invisible, red }) =>
    invisible ? "transparent" : red ? "red" : "#8F8E8C"};
  user-select: ${ifProp("invisible", "none", "auto")};
  font-size: 14px;
  text-align: center;
  max-width: 350px;
`

export const NotMainnetDisclaimer = styled.div`
  position: fixed;
  width: calc(100vw - 4em - 32px);
  top: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: red;
  color: white;
  padding: 1em 2em;
  border-radius: 4px;
  font-size: 1em;
  font-weight: bolder;
  text-align: center;
  z-index: 9999;
  line-height: 1.3em;
  ${shadowMixin};
  ${centerMixin};
  @media only screen and (min-width: 720px) {
    width: calc(100vw - 4em - 128px);
  }
  @media only screen and (min-width: 1024px) {
    width: auto;
  }

  ::before {
    content: "x";
    position: absolute;
    top: 8px;
    right: 16px;
    color: white;
  }
`

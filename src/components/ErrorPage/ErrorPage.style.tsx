import styled from "styled-components"

import Center from "../Center"
import ProfileBox from "../ProfileBox"
import ErrorSvg from "../Svgs/Error"

export const ErrorSign = styled(ErrorSvg)`
  z-index: 1;
  max-width: 120px;
  max-height: 120px;
  border-radius: 50%;
  border: 20px solid white;
  background: white;
  margin-bottom: -90px;
  @media only screen and (min-width: 480px) {
    max-width: 160px;
    max-height: 160px;
    margin-bottom: -110px;
  }
`

export const ErrorWrapper = styled(Center)`
  text-align: center;
  line-height: 2em;

  > p:first-of-type {
    margin-top: 64px;
  }
  > p + p {
    margin-top: 24px;
  }
  > p:last-of-type {
    margin-bottom: 44px;
  }
  > p {
    font-size: 24px;
  }
`

export const SBox = styled(ProfileBox)`
  h1,
  h2,
  h3,
  p {
    overflow: auto;
    white-space: normal;
    text-overflow: normal;
    text-align: center;
  }
`

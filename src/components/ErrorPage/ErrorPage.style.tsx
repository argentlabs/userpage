import styled from "styled-components"

import Center from "../Center"
import ProfileBox from "../ProfileBox"
import ErrorSvg from "../Svgs/Error"

export const ErrorSign = styled(ErrorSvg)`
  box-sizing: content-box;
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
  
  > p {
    margin-top: 24px;
    margin-bottom: 32px;
  }

  @media only screen and (min-width: 411px) {
    > p:first-of-type {
      margin-top: 48px;
    }
    > p {
      font-size: 20px;
  }
`

export const SBox = styled(ProfileBox)`
  h1,
  h2,
  h3,
  p {
    white-space: normal;
    text-overflow: normal;
    text-align: center;
  }
`

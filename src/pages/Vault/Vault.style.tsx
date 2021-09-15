import styled from "styled-components"

import Address from "../../components/Address"
import { SecondaryButtonWithIcon } from "../../components/Button/Button"
import Center from "../../components/Center"

export const ErrorText = styled.p`
  color: red;
  text-align: center;
  font-size: 14px;
  max-width: 300px;
`

export const SAddress = styled(Address)`
  ${SecondaryButtonWithIcon} {
    margin-top: 24px;
  }
`

export const SCenter = styled(Center)`
  width: 100%;
  margin-top: 24px;

  > .qrcode canvas {
    max-width: 100%;
  }

  @media only screen and (min-width: 411px) {
    > .qrcode {
      margin-top: 24px;
    }
  }

  > ${SAddress} {
    margin: 24px 0 24px;
  }

  > ${ErrorText} {
    margin-bottom: 40px;
  }
`

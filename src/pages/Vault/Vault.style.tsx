import styled from "styled-components"

import Address from "../../components/Address"
import { SecondaryButtonWithIcon } from "../../components/Button/Button"
import Center from "../../components/Center"

export const ErrorText = styled.p`
  display: block;
  background-color: #c12026;
  padding: 8px;
  color: white;
  text-align: center;
  font-size: 12px;
  max-width: 100% !important;
  border-radius: 4px;
`

export const SAddress = styled(Address)`
  > * {
    margin: 8px 0;
  }

  p {
    max-width: 220px;
  }
`

export const SCenter = styled(Center)`
  width: 100%;

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
`

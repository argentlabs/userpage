import styled from "styled-components"

import Center from "../../components/Center"

export const ErrorText = styled.p`
  color: red;
  text-align: center;
  font-size: 14px;
  max-width: 300px;
`

export const Address = styled.p`
  text-align: center;
  max-width: 220px;
  line-height: 1.3em;
  font-size: 16px;
`

export const SCenter = styled(Center)`
  > .qrcode {
    margin-top: 24px;
  }

  > ${Address} {
    margin: 24px 0 64px;
  }
`

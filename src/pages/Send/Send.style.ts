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

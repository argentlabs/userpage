import styled from "styled-components"

import Center from "../../components/Center"

export const ClaimWrapper = styled(Center)`
  > p:first-of-type {
    margin-top: 64px;
  }
  > p + p {
    margin-top: 24px;
  }
  > p:last-of-type {
    margin-bottom: 64px;
  }
`

export const InvisibleLink = styled.a`
  text-decoration: none;
`

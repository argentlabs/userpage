import styled from "styled-components"

import Center from "../../components/Center"

export const ClaimWrapper = styled(Center)`
  text-align: center;
  > p {
    margin-top: 24px;
  }
  > p:last-of-type {
    margin-bottom: 64px;
  }
  @media only screen and (min-width: 411px) {
    > p:first-of-type {
      margin-top: 64px;
    }
    > p {
      font-size: 20px;
    }
  }
`

export const InvisibleLink = styled.a`
  text-decoration: none;
`

export const AppButtonWrapper = styled(Center)`
  flex-direction: column;
  gap: 16px;

  svg {
    max-height: 48px;
    max-width: 160px;
  }

  @media only screen and (min-width: 480px) {
    flex-direction: row;
    gap: 24px;
  }
`

import styled from "styled-components"

import { centerMixin } from "../../mixins.style"

export const PageWrapper = styled.div`
  ${centerMixin}

  padding: 2rem 0;
  > a {
    margin-bottom: 2rem;
  }

  @media only screen and (min-height: 666px) {
    > a {
      margin-bottom: 3rem;
    }
  }

  @media only screen and (min-width: 480px) {
    padding: 6rem 0;
    > a {
      margin-bottom: 5rem;
    }
  }
`

import styled from "styled-components"

import { centerMixin } from "../../mixins.style"

export const PageWrapper = styled.div`
  ${centerMixin}

  padding: clamp(2rem, 8vh, 6rem) 0;
  > a {
    margin-bottom: clamp(2rem, 7vh, 5rem);
  }
`

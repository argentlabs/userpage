import styled from "styled-components"
import { ifProp } from "styled-tools"

import { centerMixin } from "../../mixins.style"

export const Box = styled.div<{ lean?: boolean }>`
  min-width: calc(100vw - 10px);
  padding-top: 128px;
  padding-bottom: ${ifProp("lean", "64px", "111px")};

  @media only screen and (min-width: 480px) {
    min-width: 480px;
  }

  background: #ffffff;
  box-shadow: 0px 4px 40px rgba(0, 0, 0, 0.04);
  border-radius: 48px;

  margin-top: -120px;

  ${centerMixin}

  h1 + h2 {
    margin-top: 16px;
  }
`

export const H1 = styled.h1`
  font-weight: bold;
  font-size: 32px;
  color: #333332;
`

export const H2 = styled.h2`
  font-size: 16px;
  color: #333332;
`

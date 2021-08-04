import styled from "styled-components"

import { centerMixin } from "../../mixins.style"

export const Circle = styled.span`
  margin-top: -41px;
  height: 64px;
  width: 64px;

  ${centerMixin}

  border-radius: 50%;
  background-color: #ff875b;
  border: 5px solid white;

  > svg {
    max-width: 28px;
    max-height: 28px;
  }

  @media only screen and (min-width: 480px) {
    height: 80px;
    width: 80px;
    > svg {
      max-width: 36px;
      max-height: 36px;
    }
  }
`

export const Clickable = styled.a`
  ${centerMixin}
  cursor: pointer;
  text-decoration: none;

  > p {
    margin-top: 5px;
  }
`

export const Text = styled.p`
  color: #5c5b59;
  font-size: 16px;
`

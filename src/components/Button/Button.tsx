import styled from "styled-components"
import { ifProp } from "styled-tools"

import { centerMixin } from "../../mixins.style"

interface ButtonProps {
  fullWidth?: boolean
}

export const Button = styled.button<ButtonProps>`
  display: block;
  background-color: #ff875b;
  color: white;
  border-radius: 100px;
  padding: 16px 32px;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 200ms ease-in-out;

  width: ${ifProp("fullWidth", "100%", "auto")};

  @media only screen and (min-width: 480px) {
    font-size: 17px;
  }

  :focus,
  :hover {
    background-color: #ff7947;
  }

  :disabled {
    background-color: #8f8e8c;
    color: rgba(255, 255, 255, 0.7);
    cursor: not-allowed;
  }
`

export const SecondaryButton = styled(Button)`
  background-color: #ededed;
  color: #333332;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 12px;

  :focus,
  :hover {
    background-color: #e6e6e6;
  }

  :disabled {
    background-color: #8f8e8c;
    color: white;
    cursor: not-allowed;
  }
`

export const SecondaryButtonWithIcon = styled(SecondaryButton)`
  background-color: #f5f3f0;
  color: #8f8e8c;

  ${centerMixin}
  flex-direction: row;

  > svg {
    height: 1em;
    margin-right: 0.5em;

    > path {
      fill: #8f8e8c;
    }
  }
`

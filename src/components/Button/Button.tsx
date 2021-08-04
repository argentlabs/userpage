import styled from "styled-components"
import { ifProp } from "styled-tools"

interface ButtonProps {
  fullWidth?: boolean
}

export const Button = styled.button<ButtonProps>`
  background-color: #ff875b;
  color: white;
  border-radius: 26px/50%;
  padding: 16px 56px;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 17px;

  width: ${ifProp("fullWidth", "100%", "auto")};
`

import styled from "styled-components"
import { prop, theme } from "styled-tools"

export const AmountInputBare = styled.input<{ length: number }>`
  min-width: calc(2em - 4px);
  max-width: calc(100vw - 30px);
  width: ${prop<any>("length")}em;
  transition: width 200ms ease-out;
  border: none;
  outline: none;
  font-size: 64px;
  font-weight: bold;
  text-align: center;
  padding: 8px;
  margin: 8px;
  background-color: transparent;
  color: ${theme("colors.fc", "#333332")};
  caret-color: ${theme("colors.fc", "#333332")};
  ::placeholder {
    color: ${theme("colors.fc", "#333332")};
  }
  :placeholder-shown {
    text-align: right;
  }
`

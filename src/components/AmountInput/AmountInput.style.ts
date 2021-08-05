import styled from "styled-components"
import { prop } from "styled-tools"

export const AmountInputBare = styled.input<{ length: number }>`
  min-width: calc(2em - 4px);
  max-width: calc(100vw - 30px);
  width: ${prop("length")}em;
  transition: width 200ms ease-out;
  border: none;
  outline: none;
  font-size: 64px;
  font-weight: bold;
  text-align: center;
  padding: 8px;
  margin: 8px;
  background-color: transparent;
  color: #333332;
  caret-color: #333332;
  ::placeholder {
    color: #333332;
  }
  :placeholder-shown {
    text-align: right;
  }
`

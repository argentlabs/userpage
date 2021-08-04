import styled from "styled-components"
import { prop } from "styled-tools"

export const AmountInputBare = styled.input<{ length: number }>`
  min-width: 4em;
  max-width: calc(100vw - 6em);
  width: ${prop("length")}em;
  border: none;
  outline: none;
  font-size: 64px;
  text-align: center;
  padding: 8px;
  margin: 8px;
  background-color: transparent;
  color: #333332;
  caret-color: #333332;
  ::placeholder {
    color: #333332;
  }
`

import styled from "styled-components"
import { theme } from "styled-tools"

import Expand from "../Svgs/Expand"

export const SExpand = styled(Expand)`
  width: 15px;
  height: 14px;
`

export const SelectInputWrapper = styled.div`
  position: relative;
`

export const Select = styled.select`
  border: none;
  border-top: 1px solid ${theme("colors.fg20", "#333332")};
  border-bottom: 1px solid ${theme("colors.fg20", "#333332")};
  border-radius: 0;

  color: ${theme("colors.fc", "#333332")};
  background-color: ${theme("colors.bg", "#white")};
  padding: 8px;
  min-width: 180px;
  appearance: none;
  transition: all 200ms ease-in-out;

  :focus-within {
    outline: none;
    border-color: #0078a4;
  }
  ::-ms-expand {
    display: none;
  }

  & + svg {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    background-color: ${theme("colors.bg", "#white")};
    padding: 8px 12px 8px 10px;
    pointer-events: none;
  }

  :disabled {
    & + svg {
      background-color: transparent;
    }
  }
`

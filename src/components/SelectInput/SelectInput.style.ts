import styled from "styled-components"

export const Select = styled.select`
  border: none;
  border-top: 1px solid #ededed;
  border-bottom: 1px solid #ededed;
  border-radius: 0;

  color: #8f8e8c;
  padding: 8px;
  min-width: 180px;
  appearance: none;

  :focus-within {
    outline: none;
    border-color: #0078a4;
  }
`

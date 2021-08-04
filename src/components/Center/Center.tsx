import styled from "styled-components"
import { prop } from "styled-tools"

import { centerMixin } from "../../mixins.style"

export interface CenterProps {
  direction?: "row" | "column" | "row-reverse" | "column-reverse"
}

export const Center = styled.div<CenterProps>`
  ${centerMixin}

  flex-direction: ${prop("direction", "inherit")};
`

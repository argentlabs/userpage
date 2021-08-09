import styled, { css } from "styled-components"
import { prop, switchProp } from "styled-tools"

import { centerMixin } from "../../mixins.style"

export interface CenterProps {
  direction?: "row" | "column" | "row-reverse" | "column-reverse"
  gap?: string
}

export const Center = styled.div<CenterProps>`
  ${centerMixin}

  flex-direction: ${prop("direction", "inherit")};

  ${({ gap }) =>
    gap
      ? css`
          ${switchProp("direction", {
            row: css`
              > * + * {
                margin-left: ${gap};
              }
            `,
            "row-reverse": css`
              > * + * {
                margin-right: ${gap};
              }
            `,
            column: css`
              > * + * {
                margin-top: ${gap};
              }
            `,
            "column-reverse": css`
              > * + * {
                margin-bottom: ${gap};
              }
            `,
          })}
        `
      : ""}
`

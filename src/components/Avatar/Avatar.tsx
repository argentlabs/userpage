import styled from "styled-components"
import { prop, theme } from "styled-tools"

import AvatarSvg from "../Svgs/Avatar"

interface AvatarProps {
  size?: string
  sizeMobile?: string
  bw?: string
  pubkey: string
}

export const Avatar = styled(AvatarSvg)<AvatarProps>`
  z-index: 1;
  max-width: ${prop<any>("sizeMobile", "120px")};
  max-height: ${prop<any>("sizeMobile", "120px")};
  border-radius: 50%;
  border: ${prop<any>("bw", "20px")} solid ${theme("colors.bg", "white")};
  color: ${theme("colors.bg", "white")};
  background-color: #0078a4;
  background: linear-gradient(#0078a4 82%, white 82%);
  /* prettier-ignore */
  margin-bottom: calc(${prop<any>("sizeMobile", "120px")} / -2 - ${prop<any>(
    "bw",
    "20px",
  )});

  @media only screen and (min-width: 480px) {
    max-width: ${prop<any>("size", "160px")};
    max-height: ${prop<any>("size", "160px")};
    /* prettier-ignore */
    margin-bottom: calc(${prop<any>("size", "160px")} / -2 - ${prop<any>(
      "bw",
      "20px",
    )});
  }
`

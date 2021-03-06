import styled from "styled-components"
import { prop, theme } from "styled-tools"

import AvatarSvg from "../Svgs/Avatar"

interface AvatarProps {
  size?: string
  sizemobile?: string
  bw?: string
  pubkey: string
}

export const Avatar = styled(AvatarSvg)<AvatarProps>`
  box-sizing: content-box;
  z-index: 1;
  max-width: ${prop<any>("sizemobile", "120px")};
  max-height: ${prop<any>("sizemobile", "120px")};
  border-radius: 50%;
  border: ${prop<any>("bw", "12px")} solid ${theme("colors.bg", "white")};
  color: ${theme("colors.bg", "white")};

  background-color: #0078a4;

  background: conic-gradient(
    from 0deg at 50% 80%,
    #0078a4 130deg,
    ${theme("colors.bg", "white")} 131deg 256deg,
    #0078a4 257deg 360deg
  );

  /* prettier-ignore */
  margin-bottom: calc(${prop<any>("sizemobile", "120px")} / -2 - ${prop<any>(
    "bw",
    "20px",
  )});

  @media only screen and (min-width: 480px) {
    max-width: ${prop<any>("size", "160px")};
    max-height: ${prop<any>("size", "160px")};
    border: ${prop<any>("bw", "20px")} solid ${theme("colors.bg", "white")};

    /* prettier-ignore */
    margin-bottom: calc(${prop<any>("size", "160px")} / -2 - ${prop<any>(
      "bw",
      "20px",
    )});
  }
`

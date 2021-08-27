import styled from "styled-components"
import { prop } from "styled-tools"

import AvatarSvg from "../Svgs/Avatar"

interface AvatarProps {
  size?: string
  sizeMobile?: string
  bw?: string
}

export const Avatar = styled(AvatarSvg)<AvatarProps>`
  z-index: 1;
  max-width: ${prop("sizeMobile", "120px")};
  max-height: ${prop("sizeMobile", "120px")};
  border-radius: 50%;
  border: ${prop("bw", "30px")} solid white;
  background: linear-gradient(#0078a4 81.25%, white 81.25%);
  @media only screen and (min-width: 480px) {
    max-width: ${prop("size", "160px")};
    max-height: ${prop("size", "160px")};
  }
`

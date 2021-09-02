import styled from "styled-components"
import { prop, theme } from "styled-tools"

// import AvatarSvg from "../Svgs/Avatar"

interface AvatarProps {
  size?: string
  sizeMobile?: string
  bw?: string
  pubkey: string
}

export const Avatar = styled.img.attrs<AvatarProps>((props) => ({
  src: `https://avatars.dicebear.com/api/avataaars/${props.pubkey}.svg?background=%230078a4`,
}))<AvatarProps>`
  z-index: 1;
  max-width: ${prop<any>("sizeMobile", "120px")};
  max-height: ${prop<any>("sizeMobile", "120px")};
  border-radius: 50%;
  border: ${prop<any>("bw", "30px")} solid ${theme("colors.bg", "white")};
  color: ${theme("colors.bg", "white")};

  @media only screen and (min-width: 480px) {
    max-width: ${prop<any>("size", "160px")};
    max-height: ${prop<any>("size", "160px")};
  }
`

import styled from "styled-components"

import AvatarSvg from "../Svgs/Avatar"

export const Avatar = styled(AvatarSvg)`
  z-index: 1;
  max-width: 120px;
  max-height: 120px;
  border-radius: 50%;
  border: 30px solid white;
  background: linear-gradient(#0078a4 81.25%, white 81.25%);
  @media only screen and (min-width: 480px) {
    max-width: 160px;
    max-height: 160px;
  }
`

import styled from "styled-components"

import ArgentLogoSvg from "../Svgs/ArgentLogo"

export const ArgentLogo = styled(ArgentLogoSvg)`
  max-height: 42px;

  @media only screen and (min-height: 666px) {
    max-height: 44px;
  }

  @media only screen and (min-width: 480px) {
    max-height: 48px;
  }
`

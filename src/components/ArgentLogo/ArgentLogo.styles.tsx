import styled from "styled-components"

import ArgentLogoSvg from "../Svgs/ArgentLogo"

export const ArgentLogo = styled(ArgentLogoSvg)`
  height: 42px;

  @media only screen and (min-height: 666px) {
    height: 44px;
  }

  @media only screen and (min-width: 480px) {
    height: 48px;
  }
`

export const Anchor = styled.a`
  text-decoration: none;
`

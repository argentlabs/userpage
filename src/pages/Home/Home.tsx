import { FC } from "react"
import styled, { css } from "styled-components/macro"

import ArgentLogo from "../../components/Svgs/ArgentLogo"
import Avatar from "../../components/Svgs/Avatar"
import Sent from "../../components/Svgs/Sent"

const centerMixin = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const HomeWrapper = styled.div`
  ${centerMixin}

  padding: 2rem 0;
  > svg {
    margin-bottom: 2rem;
  }

  @media only screen and (min-height: 666px) {
    > svg {
      margin-bottom: 4rem;
    }
  }

  @media only screen and (min-width: 480px) {
    padding: 6rem 0;
    > svg {
      margin-bottom: 8rem;
    }
  }
`

const BoxWrapper = styled.div`
  ${centerMixin}
`

const Box = styled.div`
  min-height: 280px;
  min-width: calc(100vw - 10px);
  padding-top: 20px;

  @media only screen and (min-width: 480px) {
    min-width: 480px;
  }

  background: #ffffff;
  box-shadow: 0px 4px 40px rgba(0, 0, 0, 0.04);
  border-radius: 48px;

  margin-top: -120px;

  ${centerMixin}

  h1 + h2 {
    margin-top: 16px;
  }
`

const ProfilePicture = styled(Avatar)`
  max-width: 120px;
  max-height: 120px;
  border-radius: 50%;
  border: 30px solid white;
  z-index: 2;
  background: linear-gradient(#0078a4 81.25%, white 81.25%);
  @media only screen and (min-width: 480px) {
    max-width: 160px;
    max-height: 160px;
  }
`

const H1 = styled.h1`
  font-weight: bold;
  font-size: 32px;
  color: #333332;
`

const H2 = styled.h2`
  font-size: 16px;
  color: #333332;
`

const SentBtn = styled.button`
  margin-top: -41px;
  height: 64px;
  width: 64px;

  ${centerMixin}

  border-radius: 50%;
  background-color: #ff875b;
  border: 5px solid white;

  cursor: pointer;

  > svg {
    max-width: 28px;
    max-height: 28px;
  }

  /* In the future we need to scale these down when adding more actions */
  /* @media only screen and (min-width: 480px) { */
  height: 80px;
  width: 80px;
  > svg {
    max-width: 36px;
    max-height: 36px;
  }
  /* } */
`

const SArgentLogo = styled(ArgentLogo)`
  max-height: 42px;

  @media only screen and (min-height: 666px) {
    max-height: 44px;
  }

  @media only screen and (min-width: 480px) {
    max-height: 48px;
  }
`

export const HomePage: FC = () => {
  return (
    <HomeWrapper>
      <SArgentLogo />
      <BoxWrapper>
        <ProfilePicture />
        <Box>
          <H1>@graeme</H1>
          <H2>graeme.argent.xyz</H2>
        </Box>
        <SentBtn>
          <Sent />
        </SentBtn>
      </BoxWrapper>
    </HomeWrapper>
  )
}

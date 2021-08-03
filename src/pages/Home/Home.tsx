import { FC } from "react"
import styled, { css } from "styled-components/macro"
import ArgentLogo from "../../components/Svgs/ArgentLogo"
import Sent from "../../components/Svgs/Sent"
import User from "../../components/Svgs/User"

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
    padding: 8rem 0;
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

  h1+h2 {
    margin-top: 16px;
  }
`

const ProfilePicture = styled(User)`
  border-radius: 50%;
  border: 30px solid white;
  z-index: 2;
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

const SendBtn = styled.button`
  margin-top: -41px;
  height: 82px;
  width: 82px;

  ${centerMixin}

  border-radius: 50%;
  background-color: #ff875b;
  border: 5px solid white;

  cursor: pointer;
`

export const HomePage: FC = () => {
  return (
    <HomeWrapper>
      <ArgentLogo />
      <BoxWrapper>
        <ProfilePicture />
        <Box>
          <H1>@graeme</H1>
          <H2>graeme.argent.xyz</H2>
        </Box>
        <SendBtn>
          <Sent />
        </SendBtn>
      </BoxWrapper>
    </HomeWrapper>
  )
}

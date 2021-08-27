import { FC } from "react"
import { Helmet } from "react-helmet"

import ArgentLogo from "../../components/ArgentLogo"
import Avatar from "../../components/Avatar"
import Center from "../../components/Center"
import IconButton from "../../components/IconButton"
import PageWrapper from "../../components/PageWrapper"
import Box from "../../components/ProfileBox"
import Add from "../../components/Svgs/Add"
import Gallery from "../../components/Svgs/Gallery"
import { useRouterMachine } from "../../states/hooks"
import { IconBar } from "./Home.style"

export const HomePage: FC = () => {
  const [
    {
      context: { name, ens },
    },
    send,
  ] = useRouterMachine()

  return (
    <PageWrapper>
      <Helmet>
        <title>Home - {ens}</title>
      </Helmet>
      <ArgentLogo />
      <Center>
        <Avatar />
        <Box title={`@${name}`} subtitle={ens} />
        <IconBar direction="row" gap="40px">
          <IconButton
            Icon={<Add />}
            text="Add funds"
            aria-label="Add funds"
            onClick={() => send("PUSH_SEND")}
          />
          <IconButton
            Icon={<Gallery />}
            text="NFT Gallery"
            aria-label="NFT Gallery"
            bgColor="#FFBF3D"
            onClick={() => send("PUSH_GALLERY")}
          />
        </IconBar>
      </Center>
    </PageWrapper>
  )
}

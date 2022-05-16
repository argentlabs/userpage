import { FC } from "react"
import { Helmet } from "react-helmet"

import ArgentLogo from "../../components/ArgentLogo"
import Avatar from "../../components/Avatar"
import Center from "../../components/Center"
import DarkmodeSwitch from "../../components/DarkmodeSwitch"
import IconButton from "../../components/IconButton"
import PageWrapper from "../../components/PageWrapper"
import Box from "../../components/ProfileBox"
import Add from "../../components/Svgs/Add"
import Feed from "../../components/Svgs/Feed"
import Gallery from "../../components/Svgs/Gallery"
import { useRouterMachine } from "../../states/hooks"
import { IconBar } from "./Home.style"

export const HomePage: FC = () => {
  const [
    {
      context: { name, walletAddress, hasZkSync },
    },
    send,
  ] = useRouterMachine()

  return (
    <PageWrapper>
      <DarkmodeSwitch />
      <Helmet>
        <title>Home - {name}</title>
      </Helmet>
      <ArgentLogo />
      <Center>
        <Avatar pubkey={walletAddress} />
        <Box title={`@${name}`} />
        <IconBar direction="row" gap="40px">
          <IconButton
            Icon={<Add />}
            text={hasZkSync ? "Add funds" : "Add funds to Vault"}
            aria-label={hasZkSync ? "Add funds" : "Add funds to Vault"}
            onClick={() => send("PUSH_SEND")}
          />
          <IconButton
            Icon={<Gallery />}
            text="NFT Gallery"
            aria-label="NFT Gallery"
            bgColor="#FFBF3D"
            onClick={() => send("PUSH_GALLERY")}
          />
          <IconButton
            Icon={<Feed />}
            text="Feed"
            aria-label="Feed"
            bgColor="#5CD3FF"
            onClick={() => send("PUSH_FEED")}
          />
        </IconBar>
      </Center>
    </PageWrapper>
  )
}

import { FC } from "react"
import { Helmet } from "react-helmet"

import ArgentLogo from "../../components/ArgentLogo"
import Avatar from "../../components/Avatar"
import { SecondaryButtonWithIcon } from "../../components/Button/Button"
import Center from "../../components/Center"
import DarkmodeSwitch from "../../components/DarkmodeSwitch"
import IconButton from "../../components/IconButton"
import PageWrapper from "../../components/PageWrapper"
import Box from "../../components/ProfileBox"
import Add from "../../components/Svgs/Add"
import Gallery from "../../components/Svgs/Gallery"
import Qr from "../../components/Svgs/Qr"
import { useRouterMachine } from "../../states/hooks"
import { IconBar, SAddress } from "./Home.style"

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
        <Box title={`@${name}`}>
          <SAddress
            confirmationText="Copied!"
            address={walletAddress}
            short
            zkSync={hasZkSync}
          />
          <SecondaryButtonWithIcon onClick={() => send("PUSH_VAULT")}>
            <Qr /> View address
          </SecondaryButtonWithIcon>
        </Box>
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

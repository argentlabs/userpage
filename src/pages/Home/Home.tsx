import { FC } from "react"
import { Helmet } from "react-helmet"

import ArgentLogo from "../../components/ArgentLogo"
import Center from "../../components/Center"
import DarkmodeSwitch from "../../components/DarkmodeSwitch"
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
      context: { name, hasZkSync },
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
        </IconBar>
      </Center>
    </PageWrapper>
  )
}

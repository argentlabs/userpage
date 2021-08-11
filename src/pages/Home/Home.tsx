import { FC } from "react"
import { Helmet } from "react-helmet"

import ArgentLogo from "../../components/ArgentLogo"
import Avatar from "../../components/Avatar"
import Center from "../../components/Center"
import IconButton from "../../components/IconButton"
import PageWrapper from "../../components/PageWrapper"
import Box from "../../components/ProfileBox"
import Add from "../../components/Svgs/Add"
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
        <IconBar direction="row">
          <IconButton
            Icon={<Add />}
            text="Add funds"
            onClick={() => send("PUSH_SEND")}
          />
        </IconBar>
      </Center>
    </PageWrapper>
  )
}

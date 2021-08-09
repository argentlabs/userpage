import { FC } from "react"

import ArgentLogo from "../../components/ArgentLogo"
import Avatar from "../../components/Avatar"
import Center from "../../components/Center"
import IconButton from "../../components/IconButton"
import PageWrapper from "../../components/PageWrapper"
import Box from "../../components/ProfileBox"
import Add from "../../components/Svgs/Add"
import { useRouterContextSelector } from "../../states/router"
import { IconBar } from "./Home.style"

export const HomePage: FC = () => {
  const { name, ens } = useRouterContextSelector()

  return (
    <PageWrapper>
      <ArgentLogo />
      <Center>
        <Avatar />
        <Box title={`@${name}`} subtitle={ens} />
        <IconBar direction="row">
          <IconButton Icon={<Add />} text="Add funds" href="/send" />
        </IconBar>
      </Center>
    </PageWrapper>
  )
}

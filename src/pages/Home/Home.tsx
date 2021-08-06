import { FC } from "react"

import ArgentLogo from "../../components/ArgentLogo"
import Avatar from "../../components/Avatar"
import Center from "../../components/Center"
import IconButton from "../../components/IconButton"
import PageWrapper from "../../components/PageWrapper"
import Box from "../../components/ProfileBox"
import Add from "../../components/Svgs/Add"
import { useAnsStore } from "../../libs/ans"

export const HomePage: FC = () => {
  const ans = useAnsStore()
  return (
    <PageWrapper>
      <ArgentLogo />
      <Center>
        <Avatar />
        <Box
          title={`@${ans.ens.replace(".argent.xyz", "")}`}
          subtitle={ans.ens}
        />
        <Center direction="row">
          <IconButton Icon={<Add />} text="Add funds" href="/send" />
        </Center>
      </Center>
    </PageWrapper>
  )
}

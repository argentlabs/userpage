import { FC } from "react"

import ArgentLogo from "../../components/ArgentLogo"
import Avatar from "../../components/Avatar"
import Center from "../../components/Center"
import IconButton from "../../components/IconButton"
import PageWrapper from "../../components/PageWrapper"
import Box from "../../components/ProfileBox"
import Send from "../../components/Svgs/Send"
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
          <IconButton Icon={<Send />} text="Send" href="/send" />
        </Center>
      </Center>
    </PageWrapper>
  )
}

import { FC } from "react"
import { Helmet } from "react-helmet"

import ArgentLogo from "../../components/ArgentLogo"
import Avatar from "../../components/Avatar"
import Center from "../../components/Center"
import DarkmodeSwitch from "../../components/DarkmodeSwitch"
import PageWrapper from "../../components/PageWrapper"
import Box from "../../components/ProfileBox"
import AppStore from "../../components/Svgs/AppStore"
import PlayStore from "../../components/Svgs/PlayStore"
import { useRouterContextSelector } from "../../states/hooks"
import { ClaimWrapper, InvisibleLink } from "./Claim.style"

export const ClaimPage: FC = () => {
  const { name, walletAddress } = useRouterContextSelector()

  return (
    <PageWrapper>
      <DarkmodeSwitch />
      <Helmet>
        <title>Claim - {name}.argent.xyz</title>
      </Helmet>
      <ArgentLogo />
      <Center>
        <Avatar pubkey={walletAddress} />
        <Box lean title={`${name}.argent.xyz`}>
          <ClaimWrapper direction="column">
            <p>This address is not yet registered.</p>

            <p>Download Argent to reserve it now!</p>
            <Center direction="row" gap="24px">
              <InvisibleLink
                href="https://argent.link/claim-username"
                target="_blank"
                rel="noreferrer"
              >
                <AppStore height={48} width={160} />
              </InvisibleLink>
              <InvisibleLink
                href="https://argent.link/claim-username"
                target="_blank"
                rel="noreferrer"
              >
                <PlayStore height={48} width={160} />
              </InvisibleLink>
            </Center>
          </ClaimWrapper>
        </Box>
      </Center>
    </PageWrapper>
  )
}

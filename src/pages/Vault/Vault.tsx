import { FC } from "react"
import { Helmet } from "react-helmet"

import ArgentLogo from "../../components/ArgentLogo"
import Avatar from "../../components/Avatar"
import { SecondaryButtonWithIcon } from "../../components/Button/Button"
import Center from "../../components/Center"
import DarkmodeSwitch from "../../components/DarkmodeSwitch"
import PageWrapper from "../../components/PageWrapper"
import Box from "../../components/ProfileBox"
import QRCode from "../../components/QRCode"
import Copy from "../../components/Svgs/Copy"
import { useRouterMachine } from "../../states/hooks"
import { ErrorText, SAddress, SCenter } from "./Vault.style"

export const VaultPage: FC = () => {
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
        <title>Vault - {name}</title>
      </Helmet>
      <ArgentLogo />
      <Center>
        <Avatar pubkey={walletAddress} />
        <Box lean title={name} onBackButtonClick={() => send("PUSH_HOME")}>
          <SCenter>
            <QRCode size={280} data={walletAddress} />
            <SAddress address={walletAddress} zkSync={hasZkSync}>
              <Center>
                <SecondaryButtonWithIcon>
                  <Copy /> Copy full address
                </SecondaryButtonWithIcon>
              </Center>
            </SAddress>

            {!hasZkSync && (
              <ErrorText>
                Only send to this address on Ethereum mainnet. <br />
                You will lose funds if you use any other chain.
              </ErrorText>
            )}
          </SCenter>
        </Box>
      </Center>
    </PageWrapper>
  )
}

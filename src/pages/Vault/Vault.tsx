import chunk from "lodash.chunk"
import { FC } from "react"
import CopyToClipboard from "react-copy-to-clipboard"
import { Helmet } from "react-helmet"

import ArgentLogo from "../../components/ArgentLogo"
import Avatar from "../../components/Avatar"
import Center from "../../components/Center"
import PageWrapper from "../../components/PageWrapper"
import Box from "../../components/ProfileBox"
import QRCode from "../../components/QRCode"
import { useRouterContextSelector } from "../../states/hooks"
import { Address, ErrorText, SCenter } from "./Vault.style"

const formatAddress = (address: string) =>
  `0x ${chunk(address.substr(2).split(""), 4)
    .map((x) => x.join(""))
    .join(" ")}`

export const VaultPage: FC = () => {
  const { ens, walletAddress } = useRouterContextSelector()
  return (
    <PageWrapper>
      <Helmet>
        <title>Vault - {ens}</title>
      </Helmet>
      <ArgentLogo />
      <Center>
        <Avatar />
        <Box lean title={ens}>
          <SCenter>
            <QRCode size={280} data={walletAddress} />
            <CopyToClipboard text={walletAddress}>
              <Address>{formatAddress(walletAddress)}</Address>
            </CopyToClipboard>
            <ErrorText>
              Only send to this address on Ethereum mainnet. <br />
              You will lose funds if you use any other chain.
            </ErrorText>
          </SCenter>
        </Box>
      </Center>
    </PageWrapper>
  )
}

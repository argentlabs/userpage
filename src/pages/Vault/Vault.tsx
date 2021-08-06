import chunk from "lodash.chunk"
import { FC } from "react"

import ArgentLogo from "../../components/ArgentLogo"
import Avatar from "../../components/Avatar"
import Center from "../../components/Center"
import PageWrapper from "../../components/PageWrapper"
import Box from "../../components/ProfileBox"
import QRCode from "../../components/QRCode"
import { useAnsStore } from "../../libs/ans"
import { Address, ErrorText, SCenter } from "./Vault.style"

const formatAddress = (address: string) =>
  `0x ${chunk(address.substr(2).split(""), 4)
    .map((x) => x.join(""))
    .join(" ")}`

export const VaultPage: FC = () => {
  const ans = useAnsStore()
  return (
    <PageWrapper>
      <ArgentLogo />
      <Center>
        <Avatar />
        <Box lean title={ans.ens}>
          <SCenter>
            <QRCode size={280} data={ans.walletAddress} />
            <Address>{formatAddress(ans.walletAddress)}</Address>
            <ErrorText>
              Only send to this address on Ethereum mainnet. You will lose your
              funds if you use any other chain.
            </ErrorText>
          </SCenter>
        </Box>
      </Center>
    </PageWrapper>
  )
}

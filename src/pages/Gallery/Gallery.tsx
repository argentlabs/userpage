import { Helmet } from "react-helmet"
import { withTheme } from "styled-components"

import ArgentLogo from "../../components/ArgentLogo"
import Center from "../../components/Center"
import DarkmodeSwitch from "../../components/DarkmodeSwitch"
import IconButton from "../../components/IconButton"
import PageWrapper from "../../components/PageWrapper"
import Box from "../../components/ProfileBox"
import Add from "../../components/Svgs/Add"
import Gallery from "../../components/Svgs/Gallery"
import OpenseaLogo, {
  darkProps,
  lightProps,
} from "../../components/Svgs/OpenseaLogo"
import { useGalleryMachine, useRouterMachine } from "../../states/hooks"
import { Theme } from "../../themes/theme"
import { IconBar, OpenseaWrapper, SAddress } from "./Gallery.style"
import { Grid } from "./Grid"

export const GalleryPage = withTheme(({ theme }: { theme: Theme }) => {
  const [
    {
      context: { name, walletAddress, hasZkSync },
    },
    send,
  ] = useRouterMachine()

  const [
    {
      context: { nfts },
    },
  ] = useGalleryMachine()

  return (
    <PageWrapper>
      <DarkmodeSwitch />
      <Helmet>
        <title>Gallery - {name}</title>
      </Helmet>
      <ArgentLogo />
      <Center>
        <Box
          onBackButtonClick={() => send("PUSH_HOME")}
          lean
          pt="64px"
          title={`@${name}`}
        >
          <SAddress
            confirmationText="Copied!"
            address={walletAddress}
            short
            zkSync={hasZkSync}
          />
        </Box>
        <IconBar direction="row" gap="40px">
          <IconButton
            Icon={<Add />}
            text={hasZkSync ? "Add funds" : "Add funds to Vault"}
            size={48}
            maxTextWidth={80}
            mobileSize={48}
            svgSize={24}
            mobileSvgSize={24}
            aria-label={hasZkSync ? "Add funds" : "Add funds to Vault"}
            onClick={() => send("PUSH_SEND")}
          />
          <IconButton
            Icon={<Gallery />}
            text="NFT Gallery"
            size={48}
            maxTextWidth={80}
            mobileSize={48}
            svgSize={24}
            mobileSvgSize={24}
            aria-label="NFT Gallery"
            bgColor="#FFBF3D"
            onClick={() => send("PUSH_GALLERY")}
          />
        </IconBar>
      </Center>

      <Grid
        images={nfts}
        onImageClick={(tokenId, assetContractAddress) => {
          send({ type: "PUSH_GALLERY_DETAIL", tokenId, assetContractAddress })
        }}
      />

      <OpenseaWrapper as="a" href="https://opensea.io/" target="_blank">
        <OpenseaLogo
          {...(theme.name === "dark" ? darkProps : lightProps)}
          style={{ marginRight: ".5em", height: "1.5em" }}
        />
        <span>Powered by OpenSea</span>
      </OpenseaWrapper>
    </PageWrapper>
  )
})

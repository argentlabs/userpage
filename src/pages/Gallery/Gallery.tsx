import { Helmet } from "react-helmet"
import { withTheme } from "styled-components"

import ArgentLogo from "../../components/ArgentLogo"
import Avatar from "../../components/Avatar"
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
import { Grid, IconBar, OpenseaWrapper } from "./Gallery.style"

export const GalleryPage = withTheme(({ theme }: { theme: Theme }) => {
  const [
    {
      context: { name, ens, walletAddress },
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
        <title>Gallery - {ens}</title>
      </Helmet>
      <ArgentLogo />
      <Center>
        <Avatar pubkey={walletAddress} size="80px" sizeMobile="80px" bw="5px" />
        <Box
          onBackButtonClick={() => send("PUSH_HOME")}
          lean
          mt="-45px"
          pt="80px"
          title={`@${name}`}
          subtitle={ens}
        />
        <IconBar direction="row" gap="40px">
          <IconButton
            Icon={<Add />}
            text="Add funds"
            size={48}
            mobileSize={48}
            svgSize={24}
            mobileSvgSize={24}
            aria-label="Add funds"
            onClick={() => send("PUSH_SEND")}
          />
          <IconButton
            Icon={<Gallery />}
            text="NFT Gallery"
            size={48}
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

import { useEffect } from "react"
import { FC, useState } from "react"
import { Helmet } from "react-helmet"

import ArgentLogo from "../../components/ArgentLogo"
import Avatar from "../../components/Avatar"
import Center from "../../components/Center"
import IconButton from "../../components/IconButton"
import PageWrapper from "../../components/PageWrapper"
import Box from "../../components/ProfileBox"
import Add from "../../components/Svgs/Add"
import Gallery from "../../components/Svgs/Gallery"
import { fetchNfts } from "../../libs/opensea"
import { useRouterMachine } from "../../states/hooks"
import { Grid, IconBar, ImageProp } from "./Gallery.style"

export const GalleryPage: FC = () => {
  const [
    {
      context: { name, ens, walletAddress },
    },
    send,
  ] = useRouterMachine()

  const [nfts, setNfts] = useState<ImageProp[]>([])
  useEffect(() => {
    async function main() {
      const result = await fetchNfts(walletAddress)
      setNfts(
        result.map((x) => ({
          url:
            x.animation_original_url ||
            x.animation_url ||
            x.image_original_url ||
            x.image_url ||
            x.image_preview_url ||
            x.image_thumbnail_url ||
            "https://via.placeholder.com/150",
          id: x.token_id,
          assetContractAddress: x.asset_contract.address,
        })),
      )
    }
    walletAddress && main()
  }, [walletAddress])

  return (
    <PageWrapper>
      <Helmet>
        <title>Gallery - {ens}</title>
      </Helmet>
      <ArgentLogo />
      <Center>
        <Avatar size="80px" sizeMobile="80px" bw="5px" />
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
        // images={new Array(Math.round(Math.random() * 40))
        //   .fill(0)
        //   .map((_, i) => ({
        //     url: `https://source.unsplash.com/random/800x${Math.round(
        //       300 + Math.random() * 1000,
        //     )}?${i}`,
        //     id: i,
        //   }))}
      />
    </PageWrapper>
  )
}

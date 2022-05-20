import { useAtom } from "jotai"
import { FC, Suspense } from "react"
import { Helmet } from "react-helmet"
import { useParams } from "react-router-dom"
import useSwr from "swr/immutable"

import Center from "../../components/Center"
import { MoonButton, SunButton } from "../../components/DarkmodeSwitch"
import { DelayedLoading as Loading } from "../../components/Loading"
import BigCaretLeft from "../../components/Svgs/BigCaretLeft"
import BigCaretRight from "../../components/Svgs/BigCaretRight"
import { determineNftType } from "../../libs/nft"
import { getBlobUrl, getNftMedia, getNftMediaUrl } from "../../libs/opensea"
import { useGalleryMachine, useRouterMachine } from "../../states/hooks"
import { themeAtom } from "../../themes"
import { ImageProp } from "../Gallery/Grid"
import {
  BigCaretWrapper,
  BigNftDisplay,
  CloseFullscreenButton,
  FullscreenButton,
  GoBackButton,
  InfoButton,
} from "./GalleryDetail.style"
import { useFullscreen } from "./useFullscreen"
import { useMouseBehaviour } from "./useMouseBehaviour"
import { useNft } from "./useNft"

const Controls: FC<{
  visible: boolean
  infoLink: string
  navigation?: [() => void, () => void] | false
}> = ({ visible, infoLink, navigation }) => {
  const [, send] = useRouterMachine()
  const [theme, setTheme] = useAtom(themeAtom)
  const [isFullscreen, toggleFullscreen] = useFullscreen()

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: visible ? 0 : -100,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          transition: "all 500ms ease-in-out",
          padding: 24,
          zIndex: 2,
        }}
      >
        <Center>
          {!isFullscreen && (
            <GoBackButton border="none" onClick={() => send("PUSH_GALLERY")} />
          )}
        </Center>
        <Center direction="row" gap="16px">
          {/* {isFullscreen && <PlayButton border="none" />} */}
          {isFullscreen ? (
            <CloseFullscreenButton border="none" onClick={toggleFullscreen} />
          ) : (
            <FullscreenButton border="none" onClick={toggleFullscreen} />
          )}
          <InfoButton border="none" href={infoLink} />
          {theme.name === "light" ? (
            <SunButton
              onClick={() => {
                setTheme("dark")
              }}
              border="none"
            />
          ) : (
            <MoonButton
              onClick={() => {
                setTheme("light")
              }}
              border="none"
            />
          )}
        </Center>
      </div>

      {navigation && (
        <>
          <BigCaretWrapper
            style={{
              left: visible ? 0 : "-20vw",
            }}
            onClick={navigation[0]}
          >
            <BigCaretLeft
              style={{
                width: "100%",
                maxWidth: "30px",
                justifyContent: "left",
              }}
            />
          </BigCaretWrapper>
          <BigCaretWrapper
            style={{
              right: visible ? 0 : "-20vw",
            }}
            onClick={navigation[1]}
          >
            <BigCaretRight
              style={{
                width: "100%",
                maxWidth: "30px",
                justifyContent: "right",
              }}
            />
          </BigCaretWrapper>
        </>
      )}
    </>
  )
}

const getNftNeighbours = (
  nfts: ImageProp[],
  tokenId: string,
  assetContractAddress: string,
): [ImageProp, ImageProp] | false => {
  if (nfts.length <= 1) {
    return false
  }
  const currentIndex = nfts.findIndex(
    (nft) =>
      nft.assetContractAddress === assetContractAddress && nft.id === tokenId,
  )
  const neighbours = [currentIndex - 1, currentIndex + 1]
  if (neighbours[0] < 0) {
    neighbours[0] = nfts.length - 1
  }
  if (neighbours[1] >= nfts.length) {
    neighbours[1] = 0
  }
  return [nfts[neighbours[0]], nfts[neighbours[1]]]
}

export const GalleryDetail: FC = () => {
  const { tokenId, assetContractAddress } =
    useParams<{ tokenId: string; assetContractAddress: string }>()
  const nft = useNft(tokenId, assetContractAddress)
  const { onMouseMove, controlsVisible } = useMouseBehaviour(3000)

  const [
    {
      context: { name },
    },
    send,
  ] = useRouterMachine()

  const [
    {
      context: { nfts },
    },
  ] = useGalleryMachine()

  const { data: nftBlob } = useSwr([nft], getNftMedia, { suspense: true })

  if (!nftBlob) {
    // does not happen as we use suspense
    return null
  }

  const neighbours = getNftNeighbours(nfts, tokenId, assetContractAddress)

  return (
    <Center
      onMouseMove={onMouseMove}
      style={{ height: "100vh", cursor: controlsVisible ? "inherit" : "none" }}
    >
      <Helmet>
        <title>
          {nft?.name} - {nft?.collection.name} owned by {name}
        </title>
        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`${nft?.name} - ${nft?.collection.name} owned by ${name}`}
        />
        <meta
          property="og:description"
          content={`Check out this NFT owned by ${name}`}
        />
        <meta property="og:image" content={getNftMediaUrl(nft)} />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="" />
        <meta property="twitter:url" content={window.location.href} />
        <meta
          name="twitter:title"
          content={`${nft?.name} - ${nft?.collection.name} owned by ${name}`}
        />
        <meta
          name="twitter:description"
          content={`Check out this NFT owned by ${name}`}
        />
        <meta name="twitter:image" content={getNftMediaUrl(nft)} />
      </Helmet>
      <Controls
        navigation={
          neighbours && [
            () =>
              send({
                type: "PUSH_GALLERY_DETAIL",
                assetContractAddress: neighbours[0].assetContractAddress,
                tokenId: neighbours[0].id,
              }),
            () =>
              send({
                type: "PUSH_GALLERY_DETAIL",
                assetContractAddress: neighbours[1].assetContractAddress,
                tokenId: neighbours[1].id,
              }),
          ]
        }
        infoLink={nft?.permalink || ""}
        visible={controlsVisible}
      />
      <BigNftDisplay
        type={determineNftType(nftBlob.type)}
        src={getBlobUrl(nftBlob)}
      />
    </Center>
  )
}

export const GalleryDetailPage: FC = () => {
  return (
    <Suspense
      fallback={
        <Center
          style={{
            position: "absolute",
            top: 0,
            height: "60vh",
            width: "100%",
            zIndex: -1,
          }}
        >
          <Loading />
        </Center>
      }
    >
      <GalleryDetail />
    </Suspense>
  )
}

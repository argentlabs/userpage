import { useAtom } from "jotai"
import { FC, Suspense } from "react"
import { Helmet } from "react-helmet"
import usePromise from "react-promise-suspense"
import { useParams } from "react-router-dom"

import Center from "../../components/Center"
import { MoonButton, SunButton } from "../../components/DarkmodeSwitch"
import { DelayedLoading as Loading } from "../../components/Loading"
import BigCaretLeft from "../../components/Svgs/BigCaretLeft"
import BigCaretRight from "../../components/Svgs/BigCaretRight"
import { getBlobUrl, getNftMedia } from "../../libs/opensea"
import { useGalleryMachine, useRouterMachine } from "../../states/hooks"
import { isImageMime } from "../../states/nftGallery"
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
  const [
    {
      context: { name },
    },
    send,
  ] = useRouterMachine()
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
          zIndex: 1,
        }}
      >
        <Helmet>
          <title>Gallery - {name}</title>
        </Helmet>
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
              left: visible ? 0 : -100,
            }}
            onClick={navigation[0]}
          >
            <BigCaretLeft style={{ width: "100%" }} />
          </BigCaretWrapper>
          <BigCaretWrapper
            style={{
              right: visible ? 0 : -100,
            }}
            onClick={navigation[1]}
          >
            <BigCaretRight style={{ width: "100%" }} />
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

  const [, send] = useRouterMachine()

  const [
    {
      context: { nfts },
    },
  ] = useGalleryMachine()

  const nftBlob = usePromise(getNftMedia, [nft])

  const neighbours = getNftNeighbours(nfts, tokenId, assetContractAddress)

  return (
    <Center
      onMouseMove={onMouseMove}
      style={{ height: "100vh", cursor: controlsVisible ? "inherit" : "none" }}
    >
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
        type={isImageMime(nftBlob.type) ? "img" : "video"}
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

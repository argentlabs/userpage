import { useAtom } from "jotai"
import { FC, Suspense, useEffect } from "react"
import { Helmet } from "react-helmet"
import usePromise from "react-promise-suspense"
import { useParams } from "react-router-dom"

import Center from "../../components/Center"
import { MoonButton, SunButton } from "../../components/DarkmodeSwitch"
import { DelayedLoading as Loading } from "../../components/Loading"
import { fetchNft, getNftMediaBlob } from "../../libs/opensea"
import { useGalleryMachine, useRouterMachine } from "../../states/hooks"
import { themeAtom } from "../../themes"
import { ImageProp } from "../Gallery/Grid"
import {
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
          <div
            style={{
              position: "fixed",
              left: visible ? 0 : -100,
              top: 0,
              bottom: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              transition: "all 500ms ease-in-out",
              padding: 24,
            }}
          >
            <span onClick={navigation[0]} style={{ cursor: "pointer" }}>
              {"<"}
            </span>
          </div>
          <div
            style={{
              position: "fixed",
              right: visible ? 0 : -100,
              top: 0,
              bottom: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              transition: "all 500ms ease-in-out",
              padding: 24,
            }}
          >
            <span onClick={navigation[1]} style={{ cursor: "pointer" }}>
              {">"}
            </span>
          </div>
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

  const nftBlob = usePromise(getNftMediaBlob, [nft])

  const neighbours = getNftNeighbours(nfts, tokenId, assetContractAddress)

  useEffect(() => {
    window.requestIdleCallback(() => {
      neighbours &&
        neighbours.map(async (x) => {
          console.log(x)
          const nft = await fetchNft(x.id, x.assetContractAddress)
          await getNftMediaBlob(nft)
        })
    })
  }, [neighbours])

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
      <BigNftDisplay src={nftBlob} />
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

import { useAtom } from "jotai"
import { FC, Suspense } from "react"
import { Helmet } from "react-helmet"
import { useParams } from "react-router-dom"

import Center from "../../components/Center"
import { MoonButton, SunButton } from "../../components/DarkmodeSwitch"
import { DelayedLoading as Loading } from "../../components/Loading"
import { getNftMediaUrl } from "../../libs/opensea"
import { useRouterMachine } from "../../states/hooks"
import { themeAtom } from "../../themes"
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

const Controls: FC<{ visible: boolean; infoLink: string }> = ({
  visible,
  infoLink,
}) => {
  const [
    {
      context: { name },
    },
    send,
  ] = useRouterMachine()
  const [theme, setTheme] = useAtom(themeAtom)
  const [isFullscreen, toggleFullscreen] = useFullscreen()

  return (
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
  )
}

export const GalleryDetail: FC = () => {
  const { tokenId, assetContractAddress } =
    useParams<{ tokenId: string; assetContractAddress: string }>()
  const nft = useNft(tokenId, assetContractAddress)
  const { onMouseMove, controlsVisible } = useMouseBehaviour(5000)

  return (
    <Center
      onMouseMove={onMouseMove}
      style={{ height: "100vh", cursor: controlsVisible ? "inherit" : "none" }}
    >
      <Controls infoLink={nft?.permalink || ""} visible={controlsVisible} />
      <BigNftDisplay src={getNftMediaUrl(nft, true)} />
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

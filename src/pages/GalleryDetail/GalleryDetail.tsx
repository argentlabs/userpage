import { useAtom } from "jotai"
import { Suspense, useEffect, useState } from "react"
import { useMemo } from "react"
import { useRef } from "react"
import { FC } from "react"
import { Helmet } from "react-helmet"
import { useParams } from "react-router-dom"

import Center from "../../components/Center"
import Loading from "../../components/Loading"
import { AssetElement, fetchNft } from "../../libs/opensea"
import { useRouterMachine } from "../../states/hooks"
import { themeAtom } from "../../themes"
import {
  BigNftDisplay,
  CloseFullscreenButton,
  FullscreenButton,
  GoBackButton,
  InfoButton,
  MoonButton,
  PlayButton,
  SunButton,
} from "./GalleryDetail.style"

const getNftMediaUrl = (nft?: AssetElement): string =>
  nft?.animation_original_url ||
  nft?.animation_url ||
  nft?.image_original_url ||
  nft?.image_url ||
  nft?.image_preview_url ||
  nft?.image_thumbnail_url ||
  "placehol"

const useFullscreenBehaviour = () => {
  const [controlsVisible, setControlsVisible] = useState(true)
  const [mouseCount, setMouseCount] = useState(0)
  const timeoutPid = useRef(0)

  useEffect(() => {
    if (timeoutPid.current) clearTimeout(timeoutPid.current)

    timeoutPid.current = setTimeout(() => {
      setControlsVisible(false)
    }, 5000) as unknown as number

    return () => {
      if (timeoutPid.current) clearTimeout(timeoutPid.current)
    }
  }, [mouseCount])

  return useMemo(
    () => ({
      onMouseMove: () => {
        setMouseCount((x) => ++x)
        setControlsVisible(true)
      },

      controlsVisible,
    }),
    [controlsVisible, setMouseCount, setControlsVisible],
  )
}

const useNft = (tokenId: string, assetContractAddress: string) => {
  const promiseRef = useRef<Promise<any>>()
  const [nft, setNft] = useState<AssetElement>()
  useEffect(() => {
    promiseRef.current = fetchNft(tokenId, assetContractAddress).then(setNft)
  }, [tokenId, assetContractAddress])

  if (!nft && promiseRef.current) throw promiseRef.current

  return nft
}

const Controls: FC<{ visible: boolean; infoLink: string }> = ({
  visible,
  infoLink,
}) => {
  const [
    {
      context: { ens },
    },
    send,
  ] = useRouterMachine()
  const [theme, setTheme] = useAtom(themeAtom)

  const [isFullscreen, setIsFullscreen] = useState(
    Boolean(document.fullscreenElement),
  )

  useEffect(() => {
    const fullscreenChangeHandler = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }
    document.addEventListener("fullscreenchange", fullscreenChangeHandler)

    return () => {
      document.removeEventListener("fullscreenchange", fullscreenChangeHandler)
    }
  })

  console.log(isFullscreen)

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
        <title>Gallery - {ens}</title>
      </Helmet>
      <Center>
        {!isFullscreen && (
          <GoBackButton border="none" onClick={() => send("PUSH_GALLERY")} />
        )}
      </Center>
      <Center direction="row" gap="16px">
        {isFullscreen && <PlayButton border="none" />}
        {isFullscreen ? (
          <CloseFullscreenButton
            border="none"
            onClick={() => window.document.exitFullscreen()}
          />
        ) : (
          <FullscreenButton
            border="none"
            onClick={() => window.document.documentElement.requestFullscreen()}
          />
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
  const { onMouseMove, controlsVisible } = useFullscreenBehaviour()

  return (
    <Center
      onMouseMove={onMouseMove}
      style={{ height: "100vh", cursor: controlsVisible ? "inherit" : "none" }}
    >
      <Controls infoLink={nft?.permalink || ""} visible={controlsVisible} />
      <BigNftDisplay src={getNftMediaUrl(nft)} />
    </Center>
  )
}

export const GalleryDetailPage: FC = () => {
  return (
    <Suspense
      fallback={
        <Center style={{ height: "75vh", width: "100%" }}>
          <Loading />
        </Center>
      }
    >
      <GalleryDetail />
    </Suspense>
  )
}

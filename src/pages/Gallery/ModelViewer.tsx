import "@google/model-viewer/lib/model-viewer"

import { useWindowResize } from "beautiful-react-hooks"
import { FC, useEffect, useRef, useState } from "react"

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<any, any>
    }
  }
}

interface NftModelViewerProps {
  src: string
  size?: string | number
  onLoad?: () => void
}

const NftModelViewer: FC<NftModelViewerProps> = ({ src, onLoad, size }) => {
  const [width, setWidth] = useState<number>()
  const ref = useRef<any>()
  useWindowResize(() => {
    setWidth(ref.current?.offsetWidth)
  })
  useEffect(() => {
    const modelViewer = document.querySelector("model-viewer")
    onLoad?.()
    modelViewer?.addEventListener("load", () => {
      setWidth(modelViewer?.offsetWidth)
    })
    ref.current = modelViewer
  }, [])
  return (
    <model-viewer
      src={src}
      alt={`3D model`}
      auto-rotate
      camera-controls
      shadow-intensity="1"
      poster-color="transparent"
      ar
      style={{
        width: size ?? "100%",
        height: width,
      }}
    />
  )
}

export default NftModelViewer

import QRCodeStyling from "qr-code-styling"
import { FC, useEffect, useMemo, useRef } from "react"

interface QRCodeProps {
  size: number
  data: string
}

export const QRCode: FC<QRCodeProps> = ({ size, data, ...props }) => {
  const ref = useRef<HTMLDivElement>(null)
  const qrCode = useMemo(
    () =>
      new QRCodeStyling({
        width: size,
        height: size,
        dotsOptions: { type: "dots", color: "#000000" },
        cornersSquareOptions: { type: "dot", color: "#000000" },
        cornersDotOptions: { type: "dot", color: "#000000" },
        imageOptions: {
          crossOrigin: "anonymous",
        },
      }),
    [size],
  )
  useEffect(() => {
    qrCode.append(ref.current ?? undefined)
  }, [])

  useEffect(() => {
    qrCode.update({
      data,
    })
  }, [data])

  return (
    <div
      ref={ref}
      className="qrcode"
      style={{
        borderRadius: "32px",
        overflow: "hidden",
        backgroundColor: "white",
      }}
      {...props}
    />
  )
}

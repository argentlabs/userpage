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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    qrCode.update({
      data,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return <div ref={ref} className="qrcode" {...props} />
}

import QRCodeStyling from "qr-code-styling"
import { useEffect, useMemo, useRef } from "react"
import { withTheme } from "styled-components"

import { Theme } from "../../themes/theme"

interface QRCodeProps {
  size: number
  data: string
  theme: Theme
}

export const QRCode = withTheme(
  ({ size, data, theme, ...props }: QRCodeProps) => {
    const ref = useRef<HTMLDivElement>(null)
    const qrCode = useMemo(
      () =>
        new QRCodeStyling({
          width: size,
          height: size,
          dotsOptions: { type: "dots", color: theme.colors.fc },
          cornersSquareOptions: { type: "dot", color: theme.colors.fc },
          cornersDotOptions: { type: "dot", color: theme.colors.fc },
          backgroundOptions: { color: theme.colors.bg },
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

    return <div ref={ref} className="qrcode" {...props} />
  },
)

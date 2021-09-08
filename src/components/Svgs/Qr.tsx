import React, { SVGProps } from "react"

function Qr(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 2H2v4h4V2zM2 .667C1.264.667.667 1.264.667 2v5.333h6.666V.667H2z"
        fill="#333332"
      />
      <path
        d="M3 3h2v2H3V3zM3 11h2v2H3v-2zM11 11h2v2h-2v-2zM11 3h2v2h-2V3z"
        fill="#333332"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 10H2v4h4v-4zM.667 8.667V14c0 .736.597 1.333 1.333 1.333h5.333V8.667H.667zM14 2h-4v4h4V2zM8.667.667v6.666h6.666V2c0-.736-.597-1.333-1.333-1.333H8.667zM12.667 10H10v1.333H8.667V8.667h4V10zm-4 5.333v-2.666H10v2.666H8.667zm2.666 0H14c.736 0 1.333-.597 1.333-1.333v-1.333H14V14h-2.667v1.333zm2.667-4h1.333V8.667H14v2.666z"
        fill="#333332"
      />
    </svg>
  )
}

export default Qr

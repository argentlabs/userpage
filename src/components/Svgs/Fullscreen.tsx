import React, { SVGProps } from "react"

function Fullscreen(props: SVGProps<SVGSVGElement>) {
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
        d="M0 0h4.75v1.5H2.56l3.72 3.72-1.06 1.06L1.5 2.56v2.69H0V0zM16 16h-4.75v-1.5h2.19l-3.72-3.72 1.06-1.06 3.72 3.72v-2.69H16V16zM16 0v4.75h-1.5V2.56l-3.72 3.72-1.06-1.06 3.72-3.72h-2.69V0H16zM0 16v-4.75h1.5v2.19l3.72-3.72 1.06 1.06-3.72 3.72h2.69V16H0z"
        fill="#fff"
      />
    </svg>
  )
}

export default Fullscreen

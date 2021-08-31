import React, { SVGProps } from "react"

function CloseFullscreen(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        clipPath="url(#close-fullscreen_svg__clip0)"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
      >
        <path d="M9.72 9.72h4.75v1.5h-2.19L16 14.94 14.94 16l-3.72-3.72v2.69h-1.5V9.72zM9.72 6.28V1.53h1.5v2.19L14.94 0 16 1.06l-3.72 3.72h2.69v1.5H9.72zM6.28 6.28H1.53v-1.5h2.19L0 1.06 1.06 0l3.72 3.72V1.03h1.5v5.25zM6.28 9.72v4.75h-1.5v-2.19L1.06 16 0 14.94l3.72-3.72H1.03v-1.5h5.25z" />
      </g>
      <defs>
        <clipPath id="close-fullscreen_svg__clip0">
          <path fill="currentColor" d="M0 0h16v16H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default CloseFullscreen

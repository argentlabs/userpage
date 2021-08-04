import React, { SVGProps } from "react"

function Sent(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      {...props}
    >
      <g clipPath="url(#sent_svg__clip0)">
        <path
          d="M.29 15.179a1.084 1.084 0 00.25 1.676l12.128 7.02L27.5 12.5 16.121 27.324l7.021 12.133a1.085 1.085 0 001.97-.202L36.608 4.758a1.084 1.084 0 00-1.37-1.37L.742 14.886c-.173.058-.329.159-.452.293z"
          fill="#fff"
        />
      </g>
      <defs>
        <clipPath id="sent_svg__clip0">
          <path fill="#fff" d="M0 0h40v40H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default Sent

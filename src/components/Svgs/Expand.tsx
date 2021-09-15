import React, { SVGProps } from "react"

function Expand(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 15 14"
      {...props}
    >
      <g clipPath="url(#expand_svg__clip0)" fill="#C2C0BE">
        <path d="M2.61 5.605a.73.73 0 001.03 0l3.757-3.747a.147.147 0 01.206 0l3.756 3.747a.728.728 0 101.032-1.028L8.016.213a.73.73 0 00-1.032 0L2.61 4.577a.726.726 0 000 1.028zM12.39 8.395a.73.73 0 00-1.03 0L7.603 12.14a.147.147 0 01-.206 0L3.641 8.395A.728.728 0 102.61 9.423l4.375 4.364a.73.73 0 001.03 0l4.376-4.364a.726.726 0 000-1.028z" />
      </g>
      <defs>
        <clipPath id="expand_svg__clip0">
          <path fill="#fff" transform="translate(.5)" d="M0 0h14v14H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default Expand

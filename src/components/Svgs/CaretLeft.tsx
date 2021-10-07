import React, { SVGProps } from "react"

function CaretLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      {...props}
    >
      <g clipPath="url(#caret-left_svg__clip0)">
        <path
          d="M2 7.981a1.536 1.536 0 01.519-1.152l7.42-6.54a1.227 1.227 0 012.016 1.007 1.232 1.232 0 01-.394.84l-6.488 5.72a.167.167 0 000 .25l6.488 5.72a1.23 1.23 0 01.133 1.757 1.23 1.23 0 01-1.756.092L2.522 9.136A1.54 1.54 0 012 7.981z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="caret-left_svg__clip0">
          <path fill="currentColor" d="M0 0h16v16H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default CaretLeft

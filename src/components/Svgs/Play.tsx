import React, { SVGProps } from "react"

function Play(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14.537 7.562a.5.5 0 010 .876L2.74 14.926A.5.5 0 012 14.488V1.512a.5.5 0 01.741-.438l11.796 6.488z"
        fill="#fff"
      />
    </svg>
  )
}

export default Play

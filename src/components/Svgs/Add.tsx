import React, { SVGProps } from "react"

function Add(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#add_svg__clip0)">
        <path
          d="M0 20a2.5 2.5 0 002.5 2.5h14.583a.417.417 0 01.417.417V37.5a2.5 2.5 0 005 0V22.917a.417.417 0 01.417-.417H37.5a2.5 2.5 0 000-5H22.917a.417.417 0 01-.417-.417V2.5a2.5 2.5 0 00-5 0v14.583a.417.417 0 01-.417.417H2.5A2.5 2.5 0 000 20z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="add_svg__clip0">
          <path fill="currentColor" d="M0 0h40v40H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default Add

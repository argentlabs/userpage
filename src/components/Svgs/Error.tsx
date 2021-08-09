import React, { SVGProps } from "react"

function Error(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 160"
      {...props}
    >
      <g clipPath="url(#error_svg__clip0)" fill="#C12026">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M79.993 145.976c36.451 0 65.999-29.549 65.999-65.999 0-36.45-29.548-65.999-65.999-65.999-36.45 0-65.998 29.549-65.998 66 0 36.449 29.548 65.998 65.998 65.998zm80-65.999c0 44.183-35.817 80-80 80-44.182 0-80-35.817-80-80s35.818-80 80-80c44.183 0 80 35.817 80 80z"
        />
        <path d="M70 110.269a9.842 9.842 0 019.66-10.201h.18a10.182 10.182 0 0110.155 9.801 9.836 9.836 0 01-9.66 10.201h-.18A10.196 10.196 0 0170 110.269zm3.334-26.949V43.317a6.667 6.667 0 0113.334 0V83.32a6.667 6.667 0 11-13.334 0z" />
      </g>
      <defs>
        <clipPath id="error_svg__clip0">
          <path fill="#fff" d="M0 0h160v160H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default Error

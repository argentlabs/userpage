import React, { SVGProps } from "react"

function Copy(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.667 1.333A.667.667 0 0010 .667H2.667c-.734 0-1.334.6-1.334 1.333v8.667a.667.667 0 101.334 0V3a1 1 0 011-1H10a.667.667 0 00.667-.667zm2 2H5.333C4.6 3.333 4 3.933 4 4.667V14c0 .733.6 1.333 1.333 1.333h7.334c.733 0 1.333-.6 1.333-1.333V4.667c0-.734-.6-1.334-1.333-1.334zm0 10.667H5.333V4.667h7.334V14z"
        fill="#000"
      />
    </svg>
  )
}

export default Copy

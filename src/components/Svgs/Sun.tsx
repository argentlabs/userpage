import React, { SVGProps } from "react"

function Sun(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.76 4.31L3.96 2.51 2.55 3.928l1.79 1.798L5.76 4.31zM3 9.995H0v2.01h3v-2.01zM12 0h-2v2.963h2V0zm7.45 3.928L18.04 2.51 16.25 4.31l1.41 1.416 1.79-1.798zM16.24 17.69l1.79 1.809 1.41-1.417-1.8-1.798-1.4 1.406zM19 9.995v2.01h3v-2.01h-3zm-8-5.022c-3.31 0-6 2.702-6 6.027s2.69 6.027 6 6.027 6-2.702 6-6.027-2.69-6.027-6-6.027zM10 22h2v-2.963h-2V22zm-7.45-3.928l1.41 1.417 1.79-1.809-1.41-1.416-1.79 1.808z"
        fill="#fff"
      />
    </svg>
  )
}

export default Sun

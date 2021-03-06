import React, { SVGProps } from "react"

function Info(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8.083 1.333c.297 0 .587.087.833.25.247.163.44.394.553.665a1.465 1.465 0 01-.325 1.614 1.517 1.517 0 01-1.635.321 1.496 1.496 0 01-.673-.545 1.469 1.469 0 01.186-1.87 1.51 1.51 0 011.061-.435zm2.25 13.334h-4c-.265 0-.52-.104-.707-.29a.981.981 0 010-1.396c.187-.185.442-.29.707-.29h.75c.066 0 .13-.026.177-.072a.245.245 0 00.073-.175V8a.245.245 0 00-.073-.175.252.252 0 00-.177-.072h-.75c-.265 0-.52-.104-.707-.29a.981.981 0 010-1.396c.187-.185.442-.29.707-.29h1c.53 0 1.04.209 1.414.58.375.37.586.872.586 1.396v4.691c0 .066.026.129.073.175.047.046.11.072.177.072h.75c.265 0 .52.104.707.29a.981.981 0 010 1.396c-.187.186-.442.29-.707.29z"
        fill="#fff"
      />
    </svg>
  )
}

export default Info

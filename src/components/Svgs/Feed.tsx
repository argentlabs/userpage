import React, { SVGProps } from "react"

function Feed(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <g clipPath="url(#feed_svg__a)" fill="#fff">
        <path d="M24 1.749a1 1 0 0 0-2 0v.774L3.846 8.384a.5.5 0 0 0-.346.476v5.957a.5.5 0 0 0 .35.477l1.3.408a.5.5 0 0 1 .35.477v2.591a4.505 4.505 0 0 0 4.5 4.48h.021a4.505 4.505 0 0 0 4.479-4.517v-.1l7.5 2.35v.766a1 1 0 0 0 2 0v-20ZM12.5 18.738a2.5 2.5 0 0 1-2.488 2.512H10a2.5 2.5 0 0 1-2.5-2.484v-1.647a.5.5 0 0 1 .65-.477l4 1.254a.5.5 0 0 1 .35.477v.365ZM2 8.249a1 1 0 0 0-1-1 1 1 0 0 0-1 1l.005 7a1 1 0 0 0 1 1H1a1 1 0 0 0 1-.976V8.249Z" />
      </g>
      <defs>
        <clipPath id="feed_svg__a">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default Feed

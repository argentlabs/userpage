import { FC } from "react"

import { Anchor, ArgentLogo as ArgentLogoBare } from "./ArgentLogo.styles"

export const ArgentLogo: FC = () => {
  return (
    <Anchor href="https://argent.xyz" target="_blank" rel="noreferrer">
      <ArgentLogoBare />
    </Anchor>
  )
}

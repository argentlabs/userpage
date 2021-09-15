import { FC } from "react"

import { Anchor, ArgentLogo as ArgentLogoBare } from "./ArgentLogo.styles"

export const ArgentLogo: FC = () => {
  return (
    <Anchor
      title="Argent Logo Link"
      href="https://argent.xyz"
      target="_blank"
      rel="noreferrer"
    >
      <ArgentLogoBare />
    </Anchor>
  )
}

import { FC } from "react"

import { Box, GoBackButton, H1, H2 } from "./ProfileBox.style"

interface ProfileBoxProps {
  title?: string
  subtitle?: string
  tinyTitle?: string
  lean?: boolean
  goBackButtonTo?: string
}

export const ProfileBox: FC<ProfileBoxProps> = ({
  subtitle,
  lean,
  title,
  tinyTitle,
  children,
  goBackButtonTo,
}) => {
  return (
    <Box lean={lean}>
      {goBackButtonTo && <GoBackButton href={goBackButtonTo} />}
      {title && <H1>{title}</H1>}
      {tinyTitle && <H1 tiny>{tinyTitle}</H1>}
      {subtitle && <H2>{subtitle}</H2>}
      {children}
    </Box>
  )
}

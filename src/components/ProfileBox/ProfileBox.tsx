import { FC } from "react"

import { Box, H1, H2 } from "./ProfileBox.style"

interface ProfileBoxProps {
  title?: string
  subtitle?: string
  lean?: boolean
}

export const ProfileBox: FC<ProfileBoxProps> = ({
  subtitle,
  lean,
  title,
  children,
}) => {
  return (
    <Box lean={lean}>
      {title && <H1>{title}</H1>}
      {subtitle && <H2>{subtitle}</H2>}
      {children}
    </Box>
  )
}

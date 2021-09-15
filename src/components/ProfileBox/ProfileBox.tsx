import { FC } from "react"

import { Box, BoxProps, GoBackButton, H1, H2 } from "./ProfileBox.style"

interface ProfileBoxProps extends BoxProps {
  title?: string
  subtitle?: string
  tinyTitle?: string
  onBackButtonClick?: () => void
}

export const ProfileBox: FC<ProfileBoxProps> = ({
  subtitle,
  lean,
  pt,
  title,
  tinyTitle,
  children,
  onBackButtonClick,
  ...props
}) => {
  return (
    <Box lean={lean} pt={pt} {...props}>
      {onBackButtonClick && <GoBackButton onClick={onBackButtonClick} />}
      {title && <H1>{title}</H1>}
      {tinyTitle && <H1 tiny>{tinyTitle}</H1>}
      {subtitle && <H2>{subtitle}</H2>}
      {children}
    </Box>
  )
}

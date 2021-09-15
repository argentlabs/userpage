import { FC, MouseEventHandler, ReactNode } from "react"

import { Circle, CircleProps, Clickable, Text } from "./IconButton.style"

interface IconButtonProps extends CircleProps {
  onClick?: MouseEventHandler<HTMLAnchorElement>
  href?: string
  target?: string
  Icon: ReactNode
  "aria-label": string
  text?: string
}

export const IconButton: FC<IconButtonProps> = ({
  Icon,
  text,
  size,
  svgSize,
  mobileSize,
  mobileSvgSize,
  bgColor,
  border,
  ...props
}) => {
  return (
    <Clickable role="button" {...props}>
      <Circle
        size={size}
        svgSize={svgSize}
        mobileSize={mobileSize}
        mobileSvgSize={mobileSvgSize}
        bgColor={bgColor}
        border={border}
      >
        {Icon}
      </Circle>
      {text && <Text>{text}</Text>}
    </Clickable>
  )
}

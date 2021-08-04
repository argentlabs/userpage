import { FC, MouseEventHandler, ReactNode } from "react"
import { Link } from "react-router-dom"

import { Circle, Clickable, Text } from "./IconButton.style"

interface IconButtonProps {
  onClick?: MouseEventHandler<HTMLAnchorElement>
  Icon: ReactNode
  text?: string
  href?: string
}

export const IconButton: FC<IconButtonProps> = ({
  onClick,
  Icon,
  text,
  href,
}) => {
  return (
    <Clickable as={href ? Link : undefined} to={href ?? ""} onClick={onClick}>
      <Circle>{Icon}</Circle>
      {text && <Text>{text}</Text>}
    </Clickable>
  )
}

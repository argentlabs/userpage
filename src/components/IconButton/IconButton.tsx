import { FC, MouseEventHandler, ReactNode } from "react"
import { Link } from "react-router-dom"

import { Circle, CircleProps, Clickable, Text } from "./IconButton.style"

interface IconButtonProps extends CircleProps {
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
  ...props
}) => {
  return (
    <Clickable as={href ? Link : undefined} to={href ?? ""} onClick={onClick}>
      <Circle {...props}>{Icon}</Circle>
      {text && <Text>{text}</Text>}
    </Clickable>
  )
}

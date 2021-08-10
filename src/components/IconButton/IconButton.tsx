import { FC, MouseEventHandler, ReactNode } from "react"

import { Circle, CircleProps, Clickable, Text } from "./IconButton.style"

interface IconButtonProps extends CircleProps {
  onClick?: MouseEventHandler<HTMLAnchorElement>
  Icon: ReactNode
  text?: string
}

export const IconButton: FC<IconButtonProps> = ({
  onClick,
  Icon,
  text,
  ...props
}) => {
  return (
    <Clickable onClick={onClick}>
      <Circle {...props}>{Icon}</Circle>
      {text && <Text>{text}</Text>}
    </Clickable>
  )
}

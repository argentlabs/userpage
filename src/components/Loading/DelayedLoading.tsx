import { FC } from "react"

import { useDelayedLoading } from "../../hooks/useDelayedLoading"
import { Loading, LoadingProps } from "./Loading"

interface DelayedLoadingProps extends LoadingProps {
  delay?: number
}

export const DelayedLoading: FC<DelayedLoadingProps> = ({
  delay,
  ...props
}) => {
  const show = useDelayedLoading(false, delay)

  if (!show) return null

  return <Loading {...props} />
}

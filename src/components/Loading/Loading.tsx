import Lottie from "lottie-react"
import { FC } from "react"

import loadingAnimation from "../../animations/spinner.json"

interface LoadingProps {
  size?: string
}

export const Loading: FC<LoadingProps> = ({ size = "128px" }) => (
  <Lottie
    animationData={loadingAnimation}
    loop
    style={{
      height: size,
      width: size,
    }}
  />
)

import Lottie from "lottie-react"
import { FC, useEffect, useState } from "react"

import loadingAnimation from "../../animations/spinner.json"
import ArgentLogo from "../../components/ArgentLogo"
import Center from "../../components/Center"
import PageWrapper from "../../components/PageWrapper"

export const LoadingPage: FC = () => {
  const [showLoading, setShowLoading] = useState(false)
  useEffect(() => {
    const pid = setTimeout(() => {
      setShowLoading(true)
    }, 600)
    return () => {
      clearTimeout(pid)
    }
  }, [])
  return (
    <PageWrapper>
      <ArgentLogo />
      <Center>
        {showLoading && (
          <Lottie height={130} width={130} animationData={loadingAnimation} />
        )}
      </Center>
    </PageWrapper>
  )
}
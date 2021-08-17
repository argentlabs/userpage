import { FC, useEffect, useState } from "react"
import { Helmet } from "react-helmet"

import loadingAnimation from "../../animations/spinner.json"
import ArgentLogo from "../../components/ArgentLogo"
import Center from "../../components/Center"
import PageWrapper from "../../components/PageWrapper"
import { SLottie } from "./Loading.style"

export const LoadingPage: FC = () => {
  const [showLoading, setShowLoading] = useState(false)
  useEffect(() => {
    const pid = setTimeout(() => {
      setShowLoading(true)
    }, 1000)
    return () => {
      clearTimeout(pid)
    }
  }, [])
  return (
    <PageWrapper>
      <Helmet>
        <title>Loading...</title>
      </Helmet>
      <ArgentLogo />
      <Center>
        {showLoading && <SLottie animationData={loadingAnimation} />}
      </Center>
    </PageWrapper>
  )
}

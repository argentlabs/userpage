import { FC } from "react"
import { Helmet } from "react-helmet"

import ArgentLogo from "../../components/ArgentLogo"
import Center from "../../components/Center"
import { DelayedLoading } from "../../components/Loading"
import PageWrapper from "../../components/PageWrapper"

export const LoadingPage: FC = () => {
  return (
    <PageWrapper>
      <Helmet>
        <title>Loading...</title>
      </Helmet>
      <ArgentLogo />
      <Center>
        <DelayedLoading delay={1000} />
      </Center>
    </PageWrapper>
  )
}

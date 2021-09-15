import { FC } from "react"

import ArgentLogo from "../ArgentLogo"
import Center from "../Center"
import PageWrapper from "../PageWrapper"
import { ErrorSign, ErrorWrapper, SBox } from "./ErrorPage.style"

interface ErrorPageProps {
  title: string
  descriptions?: string[]
}

export const ErrorPage: FC<ErrorPageProps> = ({
  title,
  descriptions = [],
  children,
}) => {
  return (
    <PageWrapper>
      <ArgentLogo />
      <Center>
        <ErrorSign />
        <SBox lean title={title}>
          <ErrorWrapper>
            {descriptions.map((desc) => (
              <p>{desc}</p>
            ))}
            {children}
          </ErrorWrapper>
        </SBox>
      </Center>
    </PageWrapper>
  )
}

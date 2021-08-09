import { FC } from "react"

import ErrorPage from "../../components/ErrorPage"

const Error404Page: FC = () => {
  return (
    <ErrorPage
      title="This page doesnt exist"
      descriptions={["Have you downloaded Argent yet?"]}
    />
  )
}

export default Error404Page

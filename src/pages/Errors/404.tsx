import { FC } from "react"
import { Helmet } from "react-helmet"

import ErrorPage from "../../components/ErrorPage"

const Error404Page: FC = () => {
  return (
    <>
      <Helmet>
        <title>404 - Error</title>
      </Helmet>
      <ErrorPage
        title="This page doesnt exist"
        descriptions={["Have you downloaded Argent yet?"]}
      />
    </>
  )
}

export default Error404Page

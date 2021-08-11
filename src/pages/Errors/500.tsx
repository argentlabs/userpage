import { FC } from "react"
import { Helmet } from "react-helmet"

import ErrorPage from "../../components/ErrorPage"

const Error500Page: FC = () => {
  return (
    <>
      <Helmet>
        <title>Error</title>
      </Helmet>
      <ErrorPage
        title="Oops, something went wrong!"
        descriptions={["Please try to refresh the page"]}
      />
    </>
  )
}

export default Error500Page

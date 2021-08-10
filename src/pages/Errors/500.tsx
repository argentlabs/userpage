import { FC } from "react"

import ErrorPage from "../../components/ErrorPage"

const Error500Page: FC = () => {
  return (
    <ErrorPage
      title="Oops, something went wrong!"
      descriptions={["Please try to refresh the page"]}
    />
  )
}

export default Error500Page

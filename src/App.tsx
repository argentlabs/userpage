import React, { Suspense, lazy } from "react"
import { Route, BrowserRouter as Router, Switch } from "react-router-dom"
import { createGlobalStyle } from "styled-components/macro"
import { normalize } from "styled-normalize"
import reset from "styled-reset"

import ErrorBoundary from "./components/ErrorBoundary"
import Loading from "./pages/Loading"
import { GlobalRouterStateProvider, useRouterMachine } from "./states/hooks"

const Claim = lazy(() => import("./pages/Claim"))
const NotFound = lazy(() => import("./pages/Errors/404"))
const Error500Page = lazy(() => import("./pages/Errors/500"))
const Home = lazy(() => import("./pages/Home"))
const Send = lazy(() => import("./pages/Send"))
const Vault = lazy(() => import("./pages/Vault"))

const GlobalStyle = createGlobalStyle`
  ${normalize}
  ${reset}
  /* other styles */
  body {
    background-color: #FBFBFB;
    font-family: 'Barlow', sans-serif;
  }

  .bn-onboard-custom.bn-onboard-modal {
    z-index: 99;
  }
`

function Links() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;700&display=swap"
        rel="stylesheet"
      />
    </>
  )
}

function RouterComponent() {
  const [state] = useRouterMachine()

  if (state.matches("loading")) {
    return <Loading />
  }

  return (
    <Switch>
      <Route path="/send">
        <Send />
      </Route>
      <Route path="/vault">
        <Vault />
      </Route>
      <Route path="/claim">
        <Claim />
      </Route>
      <Route path="/404">
        <NotFound />
      </Route>
      <Route path="/*">
        <Home />
      </Route>
    </Switch>
  )
}

function App() {
  return (
    <ErrorBoundary fallback={<Error500Page />}>
      <Suspense fallback={<Loading />}>
        <Router>
          <GlobalRouterStateProvider>
            <Links />
            <GlobalStyle />
            <RouterComponent />
          </GlobalRouterStateProvider>
        </Router>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App

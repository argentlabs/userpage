import { Provider as JotaiProvider } from "jotai"
import React from "react"
import { Route, BrowserRouter as Router, Switch } from "react-router-dom"
import { createGlobalStyle } from "styled-components/macro"
import { normalize } from "styled-normalize"
import reset from "styled-reset"

import Claim from "./pages/Claim"
import NotFound from "./pages/Error"
import Home from "./pages/Home"
import Loading from "./pages/Loading"
import Send from "./pages/Send"
import Vault from "./pages/Vault"
import { GlobalRouterStateProvider, useRouterMachine } from "./states/router"

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
    <Router>
      <JotaiProvider>
        <GlobalRouterStateProvider>
          <Links />
          <GlobalStyle />
          <RouterComponent />
        </GlobalRouterStateProvider>
      </JotaiProvider>
    </Router>
  )
}

export default App

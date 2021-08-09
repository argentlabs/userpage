import { Provider as JotaiProvider } from "jotai"
import React, { Suspense, useEffect } from "react"
import { Route, BrowserRouter as Router, Switch } from "react-router-dom"
import { createGlobalStyle } from "styled-components/macro"
import { normalize } from "styled-normalize"
import reset from "styled-reset"

import { useAnsStore } from "./libs/ans"
import Claim from "./pages/Claim"
import NotFound from "./pages/Error"
import Home from "./pages/Home"
import Loading from "./pages/Loading"
import Send from "./pages/Send"
import Vault from "./pages/Vault"

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

const isClaimable = (name: string): boolean => {
  return name.length >= 5 && name.length <= 30
}

function App() {
  const { fetch, hasZkSync, isError, name } = useAnsStore()

  useEffect(() => {
    const overwriteName = new URLSearchParams(window.location.search).get(
      "__overwriteName",
    )
    const domainSplitByDot = window.location.hostname.split(".")
    const name =
      new URLSearchParams(window.location.search).get("__overwriteName") ||
      (domainSplitByDot.length > 2
        ? window.location.hostname.split(".")[0]
        : "")

    fetch(name)

    // remove overwrite param
    if (overwriteName) {
      window.history.replaceState("", "", window.location.pathname)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (hasZkSync === false && window.location.pathname !== "/vault") {
      window.location.replace("/vault")
    }
  }, [hasZkSync])

  useEffect(() => {
    if (isError) {
      if (isClaimable(name)) {
        if (window.location.pathname !== "/claim") {
          window.location.replace("/claim")
        }
      } else if (window.location.pathname !== "/404") {
        window.location.replace("/404")
      }
    }
    if (
      ["/claim", "/404"].includes(window.location.pathname) &&
      isError === false
    ) {
      window.location.replace("/")
    }
  }, [isError, name])

  return (
    <JotaiProvider>
      <Router>
        <Links />
        <GlobalStyle />
        <Suspense fallback={<Loading />}>
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
            <Route path="/loading">
              <Loading />
            </Route>
            <Route path="/*">
              <Home />
            </Route>
          </Switch>
        </Suspense>
      </Router>
    </JotaiProvider>
  )
}

export default App

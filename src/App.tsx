import { Provider as JotaiProvider } from "jotai"
import React, { useEffect } from "react"
import { Route, BrowserRouter as Router, Switch } from "react-router-dom"
import { createGlobalStyle } from "styled-components/macro"
import reset from "styled-reset"

import { useAnsStore } from "./libs/ans"
import Home from "./pages/Home"
import Send from "./pages/Send"
import Vault from "./pages/Vault"

const GlobalStyle = createGlobalStyle`
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

function App() {
  const { fetch, hasZkSync } = useAnsStore()

  useEffect(() => {
    const overwriteName = new URLSearchParams(window.location.search).get(
      "__overwriteName",
    )
    const name =
      new URLSearchParams(window.location.search).get("__overwriteName") ||
      window.location.hostname.split(".")[0]

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

  return (
    <JotaiProvider>
      <Router>
        <Links />
        <GlobalStyle />
        <Switch>
          <Route path="/send">
            <Send />
          </Route>
          <Route path="/vault">
            <Vault />
          </Route>
          <Route path="/*">
            <Home />
          </Route>
        </Switch>
      </Router>
    </JotaiProvider>
  )
}

export default App

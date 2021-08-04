import { Provider as JotaiProvider } from "jotai"
import React from "react"
import { Route, BrowserRouter as Router, Switch } from "react-router-dom"
import { createGlobalStyle } from "styled-components/macro"
import reset from "styled-reset"

import Home from "./pages/Home"
import Send from "./pages/Send"

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
  return (
    <JotaiProvider>
      <Router>
        <Links />
        <GlobalStyle />
        <Switch>
          <Route path="/send">
            <Send />
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

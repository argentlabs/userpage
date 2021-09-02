import { useAtom } from "jotai"
import React, { Suspense } from "react"
import { Route, BrowserRouter as Router, Switch } from "react-router-dom"
import { ThemeProvider, createGlobalStyle } from "styled-components/macro"
import { normalize } from "styled-normalize"
import reset from "styled-reset"

import ErrorBoundary from "./components/ErrorBoundary"
import Claim from "./pages/Claim"
import NotFound from "./pages/Errors/404"
import Error500Page from "./pages/Errors/500"
import Gallery from "./pages/Gallery"
import GalleryDetail from "./pages/GalleryDetail"
import Home from "./pages/Home"
import Loading from "./pages/Loading"
import Send from "./pages/Send"
import Vault from "./pages/Vault"
import { GlobalRouterStateProvider, useRouterMachine } from "./states/hooks"
import { themeAtom } from "./themes"

const GlobalStyle = createGlobalStyle`
  ${normalize}
  ${reset}
  /* other styles */
  body {
    background-color: ${({ theme }) => theme.colors.bodyBg};
    color: ${({ theme }) => theme.colors.fc};
    font-family: 'Barlow', sans-serif;
  }

  a {
    color: ${({ theme }) => theme.colors.fc};
    text-decoration: none;
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
      <Route exact path="/gallery">
        <Gallery />
      </Route>
      <Route path="/gallery/:assetContractAddress/:tokenId">
        <GalleryDetail />
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
  const [theme] = useAtom(themeAtom)
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ErrorBoundary fallback={<Error500Page />}>
        <Suspense fallback={<Loading />}>
          <Router>
            <GlobalRouterStateProvider>
              <Links />
              <RouterComponent />
            </GlobalRouterStateProvider>
          </Router>
        </Suspense>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default App

import { useActor, useInterpret, useSelector } from "@xstate/react"
import { FC, createContext, useContext, useEffect, useMemo } from "react"
import { useHistory } from "react-router-dom"
import { ActorRefFrom, Interpreter } from "xstate"

import { analytics } from "../libs/analytics"
import { galleryMachine } from "./nftGallery"
import {
  RouterContext,
  RouterEvent,
  RouterTypestate,
  createRouterMachine,
} from "./router"
import { sendMaschine } from "./send"

const GlobalRouterStateContext = createContext<
  Interpreter<RouterContext, any, RouterEvent, RouterTypestate>
>(null as any)

export const GlobalRouterStateProvider: FC = (props) => {
  const history = useHistory()
  const routerMachine = useMemo(() => {
    console.log("ROUTER MACHINE INIT")
    return createRouterMachine(history)
  }, [history])
  const routerService = useInterpret(routerMachine)

  useEffect(
    () =>
      history.listen((location) => {
        if (
          routerService.state.meta["router." + routerService.state.value]
            .path !== location.pathname
        ) {
          routerService.send(
            `PUSH_${
              location.pathname.substr(1).toUpperCase() || "HOME"
            }` as any,
          )
        }

        analytics.page({
          path: location.pathname,
          url: window.location.href,
          title: document.title.split(" - ")[0],
        })
      }),
    [history],
  )

  return (
    <GlobalRouterStateContext.Provider value={routerService}>
      {props.children}
    </GlobalRouterStateContext.Provider>
  )
}

export const useRouterMachine = () => {
  const globalRouterService = useContext(GlobalRouterStateContext)
  return useActor(globalRouterService)
}

export const useRouterContextSelector = () => {
  const globalRouterService = useContext(GlobalRouterStateContext)
  return useSelector(globalRouterService, (state) => state.context)
}

const useSendActor = () => {
  const globalRouterService = useContext(GlobalRouterStateContext)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, send] = useActor(globalRouterService)
  return useSelector(globalRouterService, (state) => {
    if (state.children["sendMachine"])
      return state.children["sendMachine"] as ActorRefFrom<typeof sendMaschine>
    throw new Promise<ActorRefFrom<typeof sendMaschine>>((res) => {
      send("PUSH_SEND")
      res(state.children["sendMachine"] as ActorRefFrom<typeof sendMaschine>)
    })
  })
}

export const useSendMachine = () => {
  const sendMachine = useSendActor()
  return useActor(sendMachine)
}

export const useSendContextSelector = () => {
  const sendMachine = useSendActor()
  return useSelector(sendMachine, (state) => state.context)
}

const useGalleryActor = () => {
  const globalRouterService = useContext(GlobalRouterStateContext)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, send] = useActor(globalRouterService)
  return useSelector(globalRouterService, (state) => {
    if (state.children["galleryMachine"])
      return state.children["galleryMachine"] as ActorRefFrom<
        typeof galleryMachine
      >
    throw new Promise<ActorRefFrom<typeof galleryMachine>>((res) => {
      send("PUSH_SEND")
      res(
        state.children["galleryMachine"] as ActorRefFrom<typeof galleryMachine>,
      )
    })
  })
}

export const useGalleryMachine = () => {
  const galleryMachine = useGalleryActor()
  return useActor(galleryMachine)
}

export const useGalleryContextSelector = () => {
  const galleryMachine = useGalleryActor()
  return useSelector(galleryMachine, (state) => state.context)
}

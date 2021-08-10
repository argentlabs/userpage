import { useActor, useInterpret, useSelector } from "@xstate/react"
import { FC, createContext, useContext, useEffect, useMemo } from "react"
import { useHistory } from "react-router-dom"
import { ActorRefFrom, Interpreter } from "xstate"

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
        console.log(
          routerService.state.meta["router." + routerService.state.value]
            .path !== location.pathname,
        )
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

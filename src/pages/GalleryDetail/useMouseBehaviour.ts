import { useCallback, useEffect, useMemo, useRef, useState } from "react"

export const useMouseBehaviour = (delayUntilHide: number) => {
  const [controlsVisible, setControlsVisible] = useState(true)
  const timeoutPid = useRef(0)

  useEffect(() => {
    return () => {
      if (timeoutPid.current) clearTimeout(timeoutPid.current)
    }
  }, [])

  const onMouseMove = useCallback(() => {
    if (timeoutPid.current) clearTimeout(timeoutPid.current)

    timeoutPid.current = setTimeout(() => {
      setControlsVisible(false)
    }, delayUntilHide) as unknown as number

    setControlsVisible(true)
  }, [delayUntilHide])

  return useMemo(
    () => ({
      onMouseMove,
      controlsVisible,
    }),
    [controlsVisible],
  )
}

import { useEffect, useRef, useState } from "react"

export const useDelayedLoading = (
  finishedLoading: boolean,
  timeToWaitBeforeLoading: number = 500,
): Boolean => {
  const [isLoading, setIsLoading] = useState(false)
  const pid = useRef(0)

  useEffect(() => {
    if (!finishedLoading && !isLoading) {
      pid.current = setTimeout(() => {
        setIsLoading(true)
      }, timeToWaitBeforeLoading) as unknown as number
    }
    if (finishedLoading && isLoading) {
      setIsLoading(false)
    }
    return () => clearTimeout(pid.current)
  }, [finishedLoading, timeToWaitBeforeLoading])

  return isLoading
}

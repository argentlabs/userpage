import { useCallback, useEffect, useRef, useState } from "react"

export const useQueue = <T extends any>(
  timeout: number,
): [{ id: number; arg: T }[], (arg: T) => void] => {
  const [queue, setQueue] = useState<{ id: number; arg: T }[]>([])
  const pids = useRef<number[]>([])

  useEffect(() => {
    return () => {
      pids.current.forEach((pid) => {
        clearTimeout(pid)
      })
    }
  }, [])

  const addToQueue = useCallback(
    (arg) => {
      const id = Math.round(Math.random() * 100000)
      setQueue((x) => [...x, { id, arg }])

      const pid = setTimeout(() => {
        pids.current = pids.current.filter((x) => x !== pid)
        setQueue((x) => x.filter((y) => y.id !== id))
      }, timeout) as unknown as number

      pids.current.push(pid)
    },
    [setQueue, timeout],
  )

  return [queue, addToQueue]
}

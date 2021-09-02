import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react"

export const useDebounceUpdate = <T extends any>(
  updateFn: Dispatch<SetStateAction<T>>,
  delayMs: number[] = [250],
): React.Dispatch<SetStateAction<T>> => {
  const updates = useRef<SetStateAction<T>[]>([])
  const timeoutPid = useRef(0)
  const run = useRef(0)

  useEffect(() => {
    return () => {
      clearTimeout(timeoutPid.current)
    }
  }, [])

  const delayForRun = useMemo(() => {
    return delayMs[run.current] ?? delayMs[delayMs.length - 1]
  }, [delayMs, run.current])

  return useCallback(
    (s) => {
      updates.current.push(s)
      if (!timeoutPid.current) {
        timeoutPid.current = setTimeout(() => {
          timeoutPid.current = 0
          run.current++
          updates.current.map(updateFn)
          updates.current = []
        }, delayForRun) as unknown as number
      }
    },
    [delayForRun],
  )
}

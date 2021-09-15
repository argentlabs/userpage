import { useCallback, useEffect, useState } from "react"

export const useFullscreen = (
  el: HTMLElement = window.document.documentElement,
): [boolean, () => void] => {
  const [isFullscreen, setIsFullscreen] = useState(
    Boolean(document.fullscreenElement),
  )

  useEffect(() => {
    const fullscreenChangeHandler = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }
    document.addEventListener("fullscreenchange", fullscreenChangeHandler)

    return () => {
      document.removeEventListener("fullscreenchange", fullscreenChangeHandler)
    }
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      window.document.exitFullscreen()
    } else {
      el.requestFullscreen()
    }
  }, [isFullscreen, el])

  return [isFullscreen, toggleFullscreen]
}

import { useAtom } from "jotai"
import { FC } from "react"
import styled from "styled-components"

import { themeAtom } from "../../themes"
import { MoonButton, SunButton } from "./DarkmodeSwitch.style"

const DarkmodeSwitchWrapper = styled.div`
  position: absolute;
  top: 27px;
  right: 27px;
`

export const DarkmodeSwitch: FC = () => {
  const [theme, setTheme] = useAtom(themeAtom)
  return (
    <DarkmodeSwitchWrapper
      onClick={() => {
        setTheme(theme.name === "dark" ? "light" : "dark")
      }}
    >
      {theme.name === "dark" ? <MoonButton /> : <SunButton />}
    </DarkmodeSwitchWrapper>
  )
}

type ThemeName = "light" | "dark"

export interface Theme {
  name: ThemeName
  colors: {
    bodyBg: string
    bg: string
    fg: string
    fg20: string
    fc: string
    iconBg: string
  }
}

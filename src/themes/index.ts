import { atom } from "jotai"
import Cookies from "js-cookie"

import { darkTheme } from "./dark"
import { lightTheme } from "./light"
import { Theme, ThemeName } from "./theme"

export const storageKey = "themeName"

const themeNameAtom = atom<ThemeName>(
  (Cookies.get(storageKey) as ThemeName) ?? "light",
)

const getRootDomain = () => {
  return window.location.hostname
    .split(".")
    .filter((x, i, a) => i >= a.length - 2)
    .join(".")
}

export const themeAtom = atom<Theme, ThemeName>(
  (get) => (get(themeNameAtom) === "light" ? lightTheme : darkTheme),
  (_get, set, arg) => {
    Cookies.set(storageKey, arg, { domain: getRootDomain() })

    return set(themeNameAtom, arg)
  },
)

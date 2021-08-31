import { atom } from "jotai"

import { darkTheme } from "./dark"
import { lightTheme } from "./light"
import { Theme, ThemeName } from "./theme"

export const localStorageKey = "themeName"

const themeNameAtom = atom<ThemeName>(
  (localStorage.getItem("themeName") as ThemeName) ?? "light",
)

export const themeAtom = atom<Theme, ThemeName>(
  (get) => (get(themeNameAtom) === "light" ? lightTheme : darkTheme),
  (_get, set, arg) => {
    localStorage.setItem(localStorageKey, arg)

    return set(themeNameAtom, arg)
  },
)

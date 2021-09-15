import googleAnalytics from "@analytics/google-analytics"
import Analytics from "analytics"
import doNotTrack from "analytics-plugin-do-not-track"
import Cookies from "js-cookie"
import { v4 as uuid } from "uuid"

import { storageKey } from "../themes"

const { REACT_APP_GA_ID } = process.env

export const analytics = Analytics({
  app: "argent-userpage",
  plugins: [
    doNotTrack(),
    googleAnalytics({
      trackingId: REACT_APP_GA_ID,
      enabled: Boolean(REACT_APP_GA_ID),
    }),
  ],
})

const userIdStorageKey = "user-id"
export const getUserId = (): string => {
  const oldUserId = localStorage.getItem(userIdStorageKey)
  if (oldUserId) {
    return oldUserId
  }
  const newUserId = uuid()
  localStorage.setItem(userIdStorageKey, newUserId)
  return newUserId
}

export const identify = () => {
  return analytics.identify(getUserId(), {
    darkmode: Cookies.get(storageKey) === "dark",
  })
}

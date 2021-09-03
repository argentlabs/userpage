import { RampInstantSDK } from "@ramp-network/ramp-instant-sdk"

export interface RampOptions {
  walletAddress: string
}

const { REACT_APP_RAMP_API_KEY = "vto7z4chprpfy4s6rzjhc2fdsw97hngg5rhdotrv" } =
  process.env

export const showRampPromise = ({
  walletAddress,
}: RampOptions): Promise<boolean> =>
  new Promise<boolean>((res, rej) => {
    new RampInstantSDK({
      hostAppName: "Argent Userpage",
      hostLogoUrl:
        "https://images.prismic.io/argentwebsite/313db37e-055d-42ee-9476-a92bda64e61d_logo.svg?auto=format%2Ccompress&fit=max&q=50",
      userAddress: walletAddress,
      hostApiKey: REACT_APP_RAMP_API_KEY,
    })
      /** Possible Events (for more info see https://docs.ramp.network/events)
        WIDGET_CLOSE = "WIDGET_CLOSE",
        WIDGET_CONFIG_DONE = "WIDGET_CONFIG_DONE",
        WIDGET_CONFIG_FAILED = "WIDGET_CONFIG_FAILED",
        PURCHASE_CREATED = "PURCHASE_CREATED",
        PURCHASE_SUCCESSFUL = "PURCHASE_SUCCESSFUL",
        PURCHASE_FAILED = "PURCHASE_FAILED"
      */
      .on("*", (event) => {
        console.log(event)
        switch (event.type) {
          case "WIDGET_CONFIG_DONE":
            return document
              .querySelector("body > div:last-of-type")
              ?.shadowRoot?.querySelector("div.overlay")
              ?.classList.remove("ramp--loading-overwrite")
          case "WIDGET_CLOSE":
            return res(false)
          case "PURCHASE_FAILED":
          case "WIDGET_CONFIG_FAILED":
            return rej(event.type)
          case "PURCHASE_SUCCESSFUL":
            return res(true)
        }
      })
      .show()

    const styleEl = document.createElement("style")
    styleEl.appendChild(
      document.createTextNode(`
        .ramp--loading-overwrite {
          opacity: 0;
        }
      `),
    )
    document
      .querySelector("body > div:last-of-type")
      ?.shadowRoot?.querySelector("div.overlay")
      ?.classList.add("ramp--loading-overwrite")
    document
      .querySelector("body > div:last-of-type")
      ?.shadowRoot?.querySelector("div.overlay")
      ?.appendChild(styleEl)
  })

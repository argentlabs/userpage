import { ethers } from "ethers"
import createHook from "zustand"
import create from "zustand/vanilla"

interface AnsStore {
  walletAddress: string
  ens: string
  walletDeployed: boolean
  fetch: (name: string) => Promise<void>
}

export const ansStore = create<AnsStore>((set) => ({
  walletAddress: "0x0",
  ens: "",
  walletDeployed: false,
  fetch: async (name: string) => {
    try {
      const ansRes = await fetch(
        `https://cloud-test.argent-api.com/v1/wallet?ens=${name}.argent.xyz`,
      )
      if (ansRes.status >= 400) throw Error("Request failed")
      const json = await ansRes.json()
      console.log(json.walletAddress)
      set(json)
    } catch (e) {
      set({
        ens: "404",
        walletAddress: ethers.constants.AddressZero,
        walletDeployed: false,
      })
    }
  },
}))

export const useAnsStore = createHook(ansStore)

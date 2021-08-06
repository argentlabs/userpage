import { ethers } from "ethers"
import createHook from "zustand"
import create from "zustand/vanilla"

interface AnsStore {
  walletAddress: string
  ens: string
  walletDeployed: boolean | null
  hasZkSync: boolean | null
  fetch: (name: string) => Promise<void>
}

interface AnsResponse {
  walletAddress: string
  ens: string
  walletDeployed: boolean
  l2: L2
}

interface L2 {
  walletStatus: WalletStatus[]
}

interface WalletStatus {
  type: string
  hasWallet: boolean
}

export const ansStore = create<AnsStore>((set) => ({
  walletAddress: "0x0",
  ens: "",
  walletDeployed: null,
  hasZkSync: null,
  fetch: async (name: string) => {
    try {
      const ansRes = await fetch(
        `https://cloud-test.argent-api.com/v1/wallet?ens=${name}.argent.xyz`,
      )
      if (ansRes.status >= 400) throw Error("Request failed")
      const json = (await ansRes.json()) as AnsResponse
      console.log(json.walletAddress)
      set({
        walletAddress: json.walletAddress,
        ens: json.ens,
        walletDeployed: json.walletDeployed,
        hasZkSync:
          json.l2?.walletStatus?.find?.((w) => w.type === "ZK_SYNC")
            ?.hasWallet ?? false,
      })
    } catch (e) {
      set({
        ens: "404",
        walletAddress: ethers.constants.AddressZero,
        walletDeployed: false,
        hasZkSync: false,
      })
    }
  },
}))

export const useAnsStore = createHook(ansStore)

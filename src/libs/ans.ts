import createHook from "zustand"
import create from "zustand/vanilla"

interface AnsStore {
  name: string
  walletAddress: string
  ens: string
  walletDeployed: boolean | null
  hasZkSync: boolean | null
  isError: boolean | null
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

export const fetchAns = async (name: string): Promise<AnsResponse> => {
  const ansRes = await fetch(
    `https://cloud-test.argent-api.com/v1/wallet?ens=${name}.argent.xyz`,
  )
  if (ansRes.status === 404) throw Error("Not found")
  if (ansRes.status >= 400) throw Error("Request failed")

  return ansRes.json()
}

export const ansStore = create<AnsStore>((set) => ({
  name: "",
  walletAddress: "0x0",
  ens: "",
  walletDeployed: null,
  hasZkSync: null,
  isError: null,
  fetch: async (name: string) => {
    try {
      const ans = await fetchAns(name)
      console.log(ans.walletAddress)
      set({
        name,
        walletAddress: ans.walletAddress,
        ens: ans.ens,
        walletDeployed: ans.walletDeployed,
        isError: false,
        hasZkSync:
          ans.l2?.walletStatus?.find?.((w) => w.type === "ZK_SYNC")
            ?.hasWallet ?? false,
      })
    } catch (e) {
      set({
        name,
        isError: true,
      })
    }
  },
}))

export const useAnsStore = createHook(ansStore)

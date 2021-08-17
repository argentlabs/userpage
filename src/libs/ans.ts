import joinUrl from "url-join"

const { REACT_APP_ARGENT_API_ANS_WALLET_ENDPOINT } = process.env

export interface AnsResponse extends AnsGeneric {
  l2: L2
}

export interface Ans extends AnsGeneric {
  hasZkSync: boolean
}

interface AnsGeneric {
  walletAddress: string
  ens: string
  walletDeployed: boolean
}

interface L2 {
  walletStatus: WalletStatus[]
}

interface WalletStatus {
  type: string
  hasWallet: boolean
}

export const fetchAns = async (name: string): Promise<Ans> => {
  const ansRes = await fetch(
    // "https://deelay.me/5000/" + // uncomment for testing purposes, 5s delay added
    joinUrl(
      REACT_APP_ARGENT_API_ANS_WALLET_ENDPOINT,
      `?ens=${name}.argent.xyz`,
    ),
  )
  if (ansRes.status === 404) throw Error("Not found")
  if (ansRes.status >= 400) throw Error("Request failed")

  const { l2, ...response } = (await ansRes.json()) as AnsResponse

  return {
    ...response,
    hasZkSync:
      l2?.walletStatus?.find?.((w) => w.type === "ZK_SYNC")?.hasWallet ?? false,
  }
}

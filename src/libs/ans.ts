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
    // `https://deelay.me/5000/https://cloud-test.argent-api.com/v1/wallet?ens=${name}.argent.xyz`, // for testing purposes, 5s delay added
    `https://cloud-test.argent-api.com/v1/wallet?ens=${name}.argent.xyz`,
  )
  if (ansRes.status === 404) throw Error("Not found")
  if (ansRes.status >= 400) throw Error("Request failed")

  return ansRes.json()
}

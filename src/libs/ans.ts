import { ethers } from "ethers"
import chunk from "lodash.chunk"
import joinUrl from "url-join"

import { readProvider } from "./web3"
import { fetchAccount } from "./zksyncApi"

const { REACT_APP_ARGENT_API_ANS_WALLET_ENDPOINT } = process.env

export interface AnsResponse extends AnsGeneric {
  l2: L2
}

export interface Ans extends AnsGeneric {
  hasZkSync: boolean
  name: string
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

// resolve name using argent backend
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
    name,
    hasZkSync:
      l2?.walletStatus?.find?.((w) => w.type === "ZK_SYNC")?.hasWallet ?? false,
  }
}

export const getShortAddress = (address: string) =>
  chunk(address.substr(2).split(""), 4)
    .map((a) => a.join(""))
    .filter((_, i, a) => i === 0 || i === a.length - 1)
    .join("…")

export const getEnsFromAddress = (address: string) =>
  readProvider.lookupAddress(address)
export const getAddressFromEns = (name: string) =>
  readProvider.resolveName(name)

export const getUserInfo = async (name: string): Promise<Ans> => {
  // try to resolve name using argent backend
  let response = await fetchAns(name).catch(() => null)

  // if no response from argent backend
  if (!response) {
    // check if name is pure address
    if (ethers.utils.isAddress(name)) {
      const ens = await getEnsFromAddress(name).catch(() => null)
      response = {
        name: ens || getShortAddress(name),
        ens: name,
        hasZkSync: false,
        walletAddress: name,
        walletDeployed: true,
      }
      // check if name is ens
    } else if (ethers.utils.isValidName(name)) {
      const address = await getAddressFromEns(name).catch(() => null)
      if (address) {
        response = {
          name,
          ens: address,
          hasZkSync: false,
          walletAddress: address,
          walletDeployed: true,
        }
      }
    }
  }

  // couldnt resolve using one of the 3 methods
  if (!response) {
    throw new Error("Not found")
  }

  // double check zkSync
  if (!response.hasZkSync) {
    const zkAccount = await fetchAccount(response.walletAddress).catch(
      () => null,
    )
    if (
      zkAccount &&
      zkAccount.pubKeyHash !== "sync:0000000000000000000000000000000000000000"
    ) {
      response.hasZkSync = true
    }
  }

  if (response.walletAddress === "0x0239769a1adf4def9f07da824b80b9c4fcb59593") {
    response.hasZkSync = true
  }

  return response
}

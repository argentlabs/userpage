import { ethers } from "ethers"
import chunk from "lodash.chunk"
import joinUrl from "url-join"

import { readProvider } from "./web3"
import { AccountResult, fetchAccount } from "./zksyncApi"

const {
  REACT_APP_ARGENT_API_ANS_WALLET_ENDPOINT,
  REACT_APP_ANS_DOMAIN = "argent.xyz",
} = process.env

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
  enabled: boolean
}

// resolve name using argent backend
export const fetchAns = async (name: string): Promise<Ans> => {
  const ansRes = await fetch(
    // "https://deelay.me/5000/" + // uncomment for testing purposes, 5s delay added
    joinUrl(
      REACT_APP_ARGENT_API_ANS_WALLET_ENDPOINT,
      `?ens=${name}.${REACT_APP_ANS_DOMAIN}`,
    ),
  )
  if (ansRes.status === 404) throw Error("Not found")
  if (ansRes.status >= 400) throw Error("Request failed")

  const { l2, ...response } = (await ansRes.json()) as AnsResponse

  return {
    ...response,
    name,
    hasZkSync:
      l2?.walletStatus?.find?.((w) => w.type === "ZK_SYNC")?.enabled ?? false,
  }
}

export const getShortAddress = (address: string) =>
  `0x ${chunk(address.substr(2).split(""), 4)
    .map((a) => a.join(""))
    .filter((_, i, a) => i === 0 || i === a.length - 1)
    .join(" … ")}`

export const getEnsFromAddress = (address: string) =>
  readProvider.lookupAddress(address)
export const getAddressFromEns = (name: string) =>
  readProvider.resolveName(name)
const resultOrNull = <T extends any>(promise: Promise<T>): Promise<T | null> =>
  promise.catch(() => null)
const zkAccountExists = (zkAccount: AccountResult | null): boolean =>
  Boolean(zkAccount) &&
  zkAccount!.pubKeyHash !== "sync:0000000000000000000000000000000000000000"

/**
 * Resolves a given name to its address and additional info about the wallet
 *
 * @param name could be an address, an ens name or some argent user name
 * @returns ANS object containing wallet name, address, and L2 infos
 */
export const getUserInfo = async (name: string): Promise<Ans> => {
  // try to resolve name using argent backend
  let response = await resultOrNull(fetchAns(name))

  // if no response from argent backend
  if (!response) {
    // check if name is pure address
    if (ethers.utils.isAddress(name)) {
      // reverse lookup ENS
      const ens = await resultOrNull(getEnsFromAddress(name))
      response = {
        // show ens and fallback to short address
        name: ens ?? getShortAddress(name),
        ens: ens ?? "",
        hasZkSync: false,
        walletAddress: name,
        walletDeployed: true,
      }
    }
    // check if name could be ens
    else if (ethers.utils.isValidName(name)) {
      // check if ens resolves
      const address = await resultOrNull(getAddressFromEns(name))
      if (address) {
        response = {
          name,
          ens: name,
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
    const zkAccount = await resultOrNull(fetchAccount(response.walletAddress))
    if (zkAccountExists(zkAccount)) {
      response.hasZkSync = true
    }
  }

  return response
}

import Onboard from "bnc-onboard"
import { ethers } from "ethers"
import Cookies from "js-cookie"

import { storageKey } from "../themes"
import { networkId, rpcUrl } from "./web3"

const {
  REACT_APP_INFURA_KEY,
  REACT_APP_APP_NAME = "Argent Userpage",
  REACT_APP_APP_URL = "https://argent.xyz",
  REACT_APP_CONTACT_EMAIL = "devs@argent.xyz",
} = process.env

export const selectAndCheckWallet = async () => {
  await onboard.walletSelect()
  const check = await onboard.walletCheck()
  if (!check) {
    throw Error("WalletCheck failed")
  }
}

export let writeProvider: ethers.providers.Web3Provider
let gWallet: any
export const onboard = Onboard({
  networkId,
  hideBranding: true,
  darkMode: Cookies.get(storageKey) === "dark",
  subscriptions: {
    wallet: (wallet: any) => {
      if (wallet?.provider) {
        gWallet = wallet
        writeProvider = new ethers.providers.Web3Provider(wallet.provider)
      } else {
        window.location.reload()
      }
    },
    network: () => {
      writeProvider = new ethers.providers.Web3Provider(gWallet.provider)
    },
  },
  walletSelect: {
    wallets: [
      { walletName: "metamask" },
      {
        walletName: "walletConnect",
        infuraKey: REACT_APP_INFURA_KEY,
      },
      {
        walletName: "trezor",
        appUrl: REACT_APP_APP_URL,
        email: REACT_APP_CONTACT_EMAIL,
        rpcUrl,
      },
      {
        walletName: "ledger",
        rpcUrl,
      },
      { walletName: "coinbase" },
      { walletName: "walletLink", rpcUrl },
      { walletName: "authereum", disableNotifications: true },
      { walletName: "cobovault", appName: REACT_APP_APP_NAME, rpcUrl },
      {
        walletName: "lattice",
        appName: REACT_APP_APP_NAME,
        rpcUrl,
      },
      { walletName: "status" },
      //   {
      //     walletName: "portis",
      //     apiKey: "",
      //   },
      //   { walletName: "fortmatic", apiKey: "" },
      { walletName: "torus" },
      { walletName: "trust", rpcUrl },
      { walletName: "opera" },
      { walletName: "operaTouch" },
      { walletName: "imToken", rpcUrl },
      { walletName: "meetone" },
      { walletName: "mykey", rpcUrl },
      { walletName: "wallet.io", rpcUrl },
      { walletName: "huobiwallet", rpcUrl },
      { walletName: "alphawallet", rpcUrl },
      { walletName: "hyperpay" },
      { walletName: "atoken" },
      { walletName: "liquality" },
      { walletName: "frame" },
      { walletName: "tokenpocket", rpcUrl },
      { walletName: "ownbit" },
      { walletName: "gnosis" },
      { walletName: "dcent" },
      { walletName: "bitpie" },
      { walletName: "xdefi" },
      { walletName: "keepkey", rpcUrl },
    ],
  },
  walletCheck: [
    { checkName: "derivationPath" },
    { checkName: "connect" },
    { checkName: "accounts" },
    // allow Metamask users to switch network using api
    async (stateAndHelpers) => {
      const ethereumWindow = (window as any)?.ethereum
      if (
        stateAndHelpers.network !== stateAndHelpers.appNetworkId &&
        ethereumWindow?.isMetaMask
      ) {
        try {
          await ethereumWindow.request({
            method: "wallet_switchEthereumChain",
            params: [
              { chainId: `0x${stateAndHelpers.appNetworkId.toString(16)}` },
            ],
          })
        } catch {}
        return undefined
      }
    },
    { checkName: "network" },
  ],
})

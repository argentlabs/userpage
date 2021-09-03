import Onboard from "bnc-onboard"
import { ethers, providers } from "ethers"

import { storageKey } from "../themes"

const {
  REACT_APP_DESIRED_NETWORK_ID,
  REACT_APP_INFURA_KEY,
  REACT_APP_APP_NAME = "Argent Userpage",
  REACT_APP_APP_URL = "https://argent.xyz",
  REACT_APP_CONTACT_EMAIL = "devs@argent.xyz",
} = process.env

export const networkId = parseInt(REACT_APP_DESIRED_NETWORK_ID, 10)
const network = providers.getNetwork(networkId)
const networkName = network.chainId === 1 ? "mainnet" : network.name
const subdomainEtherscan = networkName === "mainnet" ? "" : `${networkName}.`

export const rpcUrl = `https://${networkName}.infura.io/v3/${REACT_APP_INFURA_KEY}`

export const ethersProvider = new ethers.providers.InfuraProvider(
  network,
  REACT_APP_INFURA_KEY,
)

export const getTransactionExplorerUrl = ({ hash }: { hash: string }) =>
  hash ? `https://${subdomainEtherscan}etherscan.io/tx/${hash}` : ""

export const selectAndCheckWallet = async () => {
  await onboard.walletSelect()
  const check = await onboard.walletCheck()
  if (!check) {
    throw Error("WalletCheck failed")
  }
}

export let web3: ethers.providers.Web3Provider
let gWallet: any
export const onboard = Onboard({
  networkId,
  hideBranding: true,
  darkMode: localStorage.getItem(storageKey) === "dark",
  subscriptions: {
    wallet: (wallet: any) => {
      if (wallet?.provider) {
        gWallet = wallet
        web3 = new ethers.providers.Web3Provider(wallet.provider)
      } else {
        window.location.reload()
      }
    },
    network: () => {
      web3 = new ethers.providers.Web3Provider(gWallet.provider)
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
      //     apiKey: "b2b7586f-2b1e-4c30-a7fb-c2d1533b153b",
      //   },
      //   { walletName: "fortmatic", apiKey: "pk_test_886ADCAB855632AA" },
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

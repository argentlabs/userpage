import Onboard from "bnc-onboard"
import { ethers, providers } from "ethers"

const DESIRED_NETWORK_ID = 3
const APP_NAME = "Argent Userpage"
const APP_URL = "https://userpage.vercel.app"
const CONTACT_EMAIL = "janek@argent.xyz"
const INFURA_KEY = "1ed4fc296a89420099d446758abd5bee"

const network = providers.getNetwork(DESIRED_NETWORK_ID)
const networkName = network.chainId === 1 ? "mainnet" : network.name
const subdomainEtherscan = networkName === "mainnet" ? "" : `${networkName}.`

export const rpcUrl = `https://${networkName}.infura.io/v3/${INFURA_KEY}`

export const getTransactionExplorerUrl = ({ hash }: { hash: string }) =>
  hash ? `https://${subdomainEtherscan}etherscan.io/tx/${hash}` : ""

export let web3: ethers.providers.Web3Provider

let gWallet: any
export const onboard = Onboard({
  networkId: DESIRED_NETWORK_ID,
  hideBranding: true,
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
        infuraKey: INFURA_KEY,
      },
      {
        walletName: "trezor",
        appUrl: APP_URL,
        email: CONTACT_EMAIL,
        rpcUrl,
      },
      {
        walletName: "ledger",
        rpcUrl,
      },
      { walletName: "coinbase" },
      { walletName: "walletLink", rpcUrl },
      { walletName: "authereum", disableNotifications: true },
      { walletName: "cobovault", appName: APP_NAME, rpcUrl },
      {
        walletName: "lattice",
        appName: APP_NAME,
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

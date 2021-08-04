import Onboard from "bnc-onboard"
import { ethers } from "ethers"

const appName = "Argent Userpage"
const infuraKey = "1ed4fc296a89420099d446758abd5bee"

export const rpcUrl = `https://rinkeby.infura.io/v3/${infuraKey}`

export let web3: ethers.providers.Web3Provider

export const onboard = Onboard({
  networkId: 3,
  hideBranding: true,
  subscriptions: {
    wallet: (wallet: any) => {
      web3 = new ethers.providers.Web3Provider(wallet.provider)
    },
  },
  walletSelect: {
    wallets: [
      { walletName: "metamask" },
      {
        walletName: "trezor",
        appUrl: "https://reactdemo.blocknative.com",
        email: "janek@argent.xyz",
        rpcUrl,
      },
      {
        walletName: "ledger",
        rpcUrl,
      },
      {
        walletName: "walletConnect",
        infuraKey,
      },
      { walletName: "cobovault", appName, rpcUrl },
      {
        walletName: "lattice",
        appName,
        rpcUrl,
      },
      { walletName: "coinbase" },
      { walletName: "status" },
      { walletName: "walletLink", rpcUrl },
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
      { walletName: "authereum", disableNotifications: true },
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
    { checkName: "network" },
  ],
})

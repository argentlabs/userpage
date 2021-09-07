import { ethers, providers } from "ethers"

const { REACT_APP_DESIRED_NETWORK_ID, REACT_APP_INFURA_KEY } = process.env

export const networkId = parseInt(REACT_APP_DESIRED_NETWORK_ID, 10)
const network = providers.getNetwork(networkId)
const networkName = network.chainId === 1 ? "mainnet" : network.name
const subdomainEtherscan = networkName === "mainnet" ? "" : `${networkName}.`

export const rpcUrl = `https://${networkName}.infura.io/v3/${REACT_APP_INFURA_KEY}`

export const readProvider = new ethers.providers.InfuraProvider(
  network,
  REACT_APP_INFURA_KEY,
)

export const getTransactionExplorerUrl = ({ hash }: { hash: string }) =>
  hash ? `https://${subdomainEtherscan}etherscan.io/tx/${hash}` : ""

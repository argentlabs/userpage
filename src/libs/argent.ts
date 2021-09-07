import { ArgentWalletDetector__factory } from "../generated"
import { readProvider } from "./web3"

const { REACT_APP_ARGENT_DETECTOR_CONTRACT_ADDRESS } = process.env

export const isArgentWallet = async (
  walletAddress: string,
): Promise<boolean> => {
  const argentDetector = ArgentWalletDetector__factory.connect(
    REACT_APP_ARGENT_DETECTOR_CONTRACT_ADDRESS,
    readProvider,
  )

  return argentDetector.isArgentWallet(walletAddress)
}

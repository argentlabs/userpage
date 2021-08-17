import { ArgentWalletDetector__factory } from "../generated"
import { web3 } from "./web3"

const { REACT_APP_ARGENT_DETECTOR_CONTRACT_ADDRESS } = process.env

export const isArgentWallet = async (
  walletAddress: string,
): Promise<boolean> => {
  const argentDetector = ArgentWalletDetector__factory.connect(
    REACT_APP_ARGENT_DETECTOR_CONTRACT_ADDRESS,
    web3,
  )

  return argentDetector.isArgentWallet(walletAddress)
}

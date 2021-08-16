import { ArgentWalletDetector__factory } from "../generated"
import { web3 } from "./web3"

const {
  ARGENT_DETECTOR_CONTRACT = "0xF230cF8980BaDA094720C01308319eF192F0F311",
} = process.env

export const isArgentWallet = async (
  walletAddress: string,
): Promise<boolean> => {
  const argentDetector = ArgentWalletDetector__factory.connect(
    ARGENT_DETECTOR_CONTRACT,
    web3,
  )

  return argentDetector.isArgentWallet(walletAddress)
}

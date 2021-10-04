import usePromise from "react-promise-suspense"

import { AssetElement, fetchNft } from "../../libs/opensea"

export const useNft = (
  tokenId: string,
  assetContractAddress: string,
): AssetElement | undefined => {
  return usePromise(fetchNft, [tokenId, assetContractAddress])
}

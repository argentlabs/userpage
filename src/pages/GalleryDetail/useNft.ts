import useSWR from "swr/immutable"

import { AssetElement, fetchNft } from "../../libs/opensea"

export const useNft = (
  tokenId: string,
  assetContractAddress: string,
): AssetElement | undefined => {
  const { data } = useSWR([tokenId, assetContractAddress], fetchNft, {
    suspense: true,
  })
  return data
}

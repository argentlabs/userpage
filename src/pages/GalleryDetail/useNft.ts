import { useEffect, useRef, useState } from "react"

import { AssetElement, fetchNft } from "../../libs/opensea"

export const useNft = (tokenId: string, assetContractAddress: string) => {
  const promiseRef = useRef<Promise<any>>()
  const [nft, setNft] = useState<AssetElement>()
  useEffect(() => {
    promiseRef.current = fetchNft(tokenId, assetContractAddress).then(setNft)
  }, [tokenId, assetContractAddress])

  if (!nft && promiseRef.current) throw promiseRef.current

  return nft
}

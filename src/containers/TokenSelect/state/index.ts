import { BigNumber, ethers } from "ethers"
import { atom } from "jotai"

import { web3 } from "../../../libs/web3"
import { getERC20Balances } from "./erc20"
import { fetchTokenList } from "./zksyncApi"

export const tokensAtom = atom(async () => {
  const zksyncRes = await fetchTokenList()
  const signer = web3.getSigner(0)

  const balances = await getERC20Balances(
    web3,
    await signer.getAddress(),
    zksyncRes.map((token) => token.address),
  )
  console.log(balances)
  const tokens = zksyncRes
    .filter((token) => token.address !== ethers.constants.AddressZero)
    .map((token) => ({
      address: token.address,
      decimals: token.decimals,
      symbol: token.symbol,
      balance:
        balances.find((x) => x.address === token.address)?.balance ||
        BigNumber.from(0),
    }))
    .sort((a, b) =>
      a.balance.gt(0) && b.balance.gt(0) ? 0 : a.balance.gt(0) ? -1 : 1,
    )

  tokens.unshift({
    address: ethers.constants.AddressZero,
    balance: await signer.getBalance(),
    decimals: 18,
    symbol: "ETH",
  })

  return tokens
})

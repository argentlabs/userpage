import { BigNumber, ethers } from "ethers"
import { atom } from "jotai"

import { web3 } from "../../../libs/web3"
import { getERC20BalancesAndAllowances } from "./erc20"
import { fetchConfig, fetchTokenList } from "./zksyncApi"

export const tokensAtom = atom(async () => {
  const [zksyncTokenRes, zksyncConfigRes] = await Promise.all([
    fetchTokenList(),
    fetchConfig(),
  ])
  const signer = web3.getSigner(0)
  const zksyncTokens = zksyncTokenRes.filter(
    (token) => token.address !== ethers.constants.AddressZero,
  )

  const balances = await getERC20BalancesAndAllowances(
    web3,
    await signer.getAddress(),
    zksyncTokens.map((token) => token.address),
    zksyncConfigRes.contract,
  )

  const tokens = zksyncTokens
    .map((token) => ({
      address: token.address,
      decimals: token.decimals,
      symbol: token.symbol,
      allowance:
        balances.find((x) => x.address === token.address)?.allowance ||
        BigNumber.from(0),
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
    allowance: BigNumber.from(-1),
    symbol: "ETH",
  })

  return tokens
})

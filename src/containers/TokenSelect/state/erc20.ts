import { BigNumber, ethers } from "ethers"
import chunk from "lodash.chunk"

import ERC20_ABI from "./abis/ERC20.json"
import MULTICALL_ABI from "./abis/Multicall.json"

export const getERC20BalancesAndAllowances = async (
  provider: ethers.providers.JsonRpcProvider,
  address: string,
  tokens: string[],
  spender: string,
): Promise<{ address: string; balance: BigNumber; allowance: BigNumber }[]> => {
  const contract = new ethers.Contract(
    "0x604D19Ba889A223693B0E78bC1269760B291b9Df",
    MULTICALL_ABI,
    provider,
  )
  const erc20Interface = new ethers.utils.Interface(ERC20_ABI)

  const operations = (token?: string) => [
    [token, erc20Interface.encodeFunctionData("balanceOf", [address])],
    [token, erc20Interface.encodeFunctionData("allowance", [address, spender])],
  ]
  const data = tokens.map(operations).reduce((acc, val) => acc.concat(val), [])

  const result = await contract.aggregate(data)

  const MULTICALL_FAIL = ethers.utils.id("MULTICALL_FAIL")
  const decode = (method: string, data: any) => {
    if (data === MULTICALL_FAIL) throw new Error()
    return erc20Interface.decodeFunctionResult(method, data)[0]
  }

  return chunk(result.returnData, operations().length)
    .map((data: any[], index: number) => {
      try {
        console.log({
          address: tokens[index],
          balance: decode("balanceOf", data[0]).toString(),
          allowance: decode("allowance", data[1]).toString(),
        })
        return {
          address: tokens[index],
          balance: decode("balanceOf", data[0]),
          allowance: decode("allowance", data[1]),
        }
      } catch (error) {
        console.error(tokens[index])
        return null
      }
    })
    .filter((x: any) => !!x) as any
}

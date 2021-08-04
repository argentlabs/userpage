import { BigNumber, ethers } from "ethers"

import ERC20_ABI from "./abis/ERC20.json"
import MULTICALL_ABI from "./abis/Multicall.json"

export const getERC20Balances = async (
  provider: ethers.providers.JsonRpcProvider,
  address: string,
  tokens: string[],
): Promise<{ address: string; balance: BigNumber }[]> => {
  const contract = new ethers.Contract(
    "0x604D19Ba889A223693B0E78bC1269760B291b9Df",
    MULTICALL_ABI,
    provider,
  )
  const erc20Interface = new ethers.utils.Interface(ERC20_ABI)

  const data = tokens.map((token) => [
    token,
    erc20Interface.encodeFunctionData("balanceOf", [address]),
  ])

  const result = await contract.aggregate(data)

  const MULTICALL_FAIL = ethers.utils.id("MULTICALL_FAIL")
  const decode = (method: string, data: any) => {
    if (data === MULTICALL_FAIL) throw new Error()
    return erc20Interface.decodeFunctionResult(method, data)[0]
  }

  return result.returnData
    .map((data: any, index: number) => {
      try {
        return {
          address: tokens[index],
          balance: decode("balanceOf", data),
        }
      } catch (error) {
        console.log("knbasdf")
        return null
      }
    })
    .filter((x: any) => !!x)
}

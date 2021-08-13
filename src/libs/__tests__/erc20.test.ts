/**
 * @jest-environment node
 */

import { deployMockContract } from "@ethereum-waffle/mock-contract"
import { MockProvider } from "@ethereum-waffle/provider"
import { BigNumber, utils } from "ethers"

import { ERC20__factory, Multicall__factory } from "../../generated"
import { getERC20BalancesAndAllowances } from "../erc20"

describe("[unit] ERC20", () => {
  it("transforms multicall response correctly", async () => {
    const provider = new MockProvider()
    const [wallet, spender, erc20] = provider.getWallets()
    const erc20Interface = ERC20__factory.createInterface()
    const mockMulticall = await deployMockContract(
      wallet,
      Multicall__factory.abi,
    )
    await mockMulticall.mock["aggregate"].returns(provider.blockNumber, [
      erc20Interface.encodeFunctionResult("balanceOf", [BigNumber.from(10)]),
      erc20Interface.encodeFunctionResult("allowance", [BigNumber.from(5)]),
    ])

    const multicall = Multicall__factory.connect(mockMulticall.address, wallet)

    expect(process.env.MULTICALL_ADDRESS).toBe(multicall.address)

    const result = await getERC20BalancesAndAllowances(
      provider,
      wallet.address,
      [erc20.address],
      spender.address,
    )

    // token list contains 1 token, as given
    expect(result.length).toBe(1)
    // that token has the right address
    expect(result[0].address).toBe(erc20.address)
    // that token has the right balance
    expect(result[0].balance).toEqBN(10)
    // that token has the right allowance
    expect(result[0].allowance).toEqBN(5)
  })
  it("transforms multicall response correctly when at least one succeeds", async () => {
    const provider = new MockProvider()
    const [wallet, spender, erc20_1, erc20_2] = provider.getWallets()
    const erc20Interface = ERC20__factory.createInterface()
    const mockMulticall = await deployMockContract(
      wallet,
      Multicall__factory.abi,
    )
    await mockMulticall.mock["aggregate"].returns(provider.blockNumber, [
      erc20Interface.encodeFunctionResult("balanceOf", [BigNumber.from(10)]),
      erc20Interface.encodeFunctionResult("allowance", [BigNumber.from(5)]),
      utils.id("MULTICALL_FAIL"),
      utils.id("MULTICALL_FAIL"),
    ])

    const multicall = Multicall__factory.connect(mockMulticall.address, wallet)

    expect(process.env.MULTICALL_ADDRESS).toBe(multicall.address)

    const result = await getERC20BalancesAndAllowances(
      provider,
      wallet.address,
      [erc20_1.address, erc20_2.address],
      spender.address,
    )

    // token list contains 1 token, as given
    expect(result.length).toBe(1)
    // that token has the right address
    expect(result[0].address).toBe(erc20_1.address)
    // that token has the right balance
    expect(result[0].balance).toEqBN(10)
    // that token has the right allowance
    expect(result[0].allowance).toEqBN(5)
  })
  it("transforms multicall response with multiple tokens", async () => {
    const provider = new MockProvider()
    const [wallet, spender, erc20_1, erc20_2] = provider.getWallets()
    const erc20Interface = ERC20__factory.createInterface()
    const mockMulticall = await deployMockContract(
      wallet,
      Multicall__factory.abi,
    )
    await mockMulticall.mock["aggregate"].returns(provider.blockNumber, [
      erc20Interface.encodeFunctionResult("balanceOf", [BigNumber.from(10)]),
      erc20Interface.encodeFunctionResult("allowance", [BigNumber.from(5)]),
      erc20Interface.encodeFunctionResult("balanceOf", [BigNumber.from(20)]),
      erc20Interface.encodeFunctionResult("allowance", [BigNumber.from(15)]),
    ])

    const multicall = Multicall__factory.connect(mockMulticall.address, wallet)

    expect(process.env.MULTICALL_ADDRESS).toBe(multicall.address)

    const result = await getERC20BalancesAndAllowances(
      provider,
      wallet.address,
      [erc20_1.address, erc20_2.address],
      spender.address,
    )

    // token list contains 2 token, as given
    expect(result.length).toBe(2)
    // that token has the right address
    expect(result[0].address).toBe(erc20_1.address)
    // that token has the right balance
    expect(result[0].balance).toEqBN(10)
    // that token has the right allowance
    expect(result[0].allowance).toEqBN(5)
    // that token has the right address
    expect(result[1].address).toBe(erc20_2.address)
    // that token has the right balance
    expect(result[1].balance).toEqBN(20)
    // that token has the right allowance
    expect(result[1].allowance).toEqBN(15)
  })
})

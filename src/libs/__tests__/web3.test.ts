import { getTransactionExplorerUrl, rpcUrl } from "../web3"

describe("[unit] web3", () => {
  it("has right rpc endpoint", () => {
    expect(rpcUrl).toBe("https://ropsten.infura.io/v3/test_infura_id")
  })
  it("returns correct explorer url", () => {
    expect(getTransactionExplorerUrl({ hash: "test" })).toBe(
      "https://ropsten.etherscan.io/tx/test",
    )
  })
  it("returns empty explorer url when no has given", () => {
    expect(getTransactionExplorerUrl({ hash: "" })).toBe("")
  })
})

import fetchMock from "jest-fetch-mock"

import { Ans, AnsResponse, fetchAns } from "../ans"

describe("[unit] ANS", () => {
  beforeAll(() => {
    fetchMock.enableMocks()
  })
  beforeEach(() => {
    fetchMock.resetMocks()
  })
  afterAll(() => {
    fetchMock.disableMocks()
  })
  it("transforms 200 with zksync", async () => {
    const mockResponse: AnsResponse = {
      ens: "graeme-goerli1.argent.xyz",
      walletAddress: "0x3ea72d4967Bbcf2385D879D4FFeD51D9DDF5eD06",
      walletDeployed: true,
      l2: {
        walletStatus: [{ type: "ZK_SYNC", enabled: true, hasWallet: true }],
      },
    }
    const expectedResult: Ans = {
      ens: "graeme-goerli1.argent.xyz",
      walletAddress: "0x3ea72d4967Bbcf2385D879D4FFeD51D9DDF5eD06",
      walletDeployed: true,
      hasZkSync: true,
      name: "graeme-goerli1",
    }
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse))

    const response = await fetchAns("graeme-goerli1")

    expect(response).toStrictEqual(expectedResult)
  })
  it("transforms 200 without zksync", async () => {
    const mockResponse: AnsResponse = {
      ens: "graeme-goerli1.argent.xyz",
      walletAddress: "0x3ea72d4967Bbcf2385D879D4FFeD51D9DDF5eD06",
      walletDeployed: true,
      l2: {
        walletStatus: [{ type: "ZK_SYNC", enabled: false, hasWallet: true }],
      },
    }
    const expectedResult: Ans = {
      ens: "graeme-goerli1.argent.xyz",
      walletAddress: "0x3ea72d4967Bbcf2385D879D4FFeD51D9DDF5eD06",
      walletDeployed: true,
      hasZkSync: false,
      name: "graeme-goerli1",
    }
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse))

    const response = await fetchAns("graeme-goerli1")

    expect(response).toStrictEqual(expectedResult)
  })
  it("throws on 404", async () => {
    fetchMock.mockOnce(async () => ({ status: 404, body: "" }))

    await expect(fetchAns("graeme-goerli1")).rejects.toThrowError("Not found")
  })
  it("throws on 500", async () => {
    fetchMock.mockOnce(async () => ({ status: 500, body: "" }))

    await expect(fetchAns("graeme-goerli1")).rejects.toThrowError(
      "Request failed",
    )
  })
})

describe("[int] ANS", () => {
  it("works with 'graeme-goerli1'", async () => {
    const fetchReal = fetch

    fetchMock.enableMocks()

    const expectedResult: Ans = {
      ens: "graeme-goerli1.argent.xyz",
      name: "graeme-goerli1",
      walletAddress: "0x3ea72d4967Bbcf2385D879D4FFeD51D9DDF5eD06",
      walletDeployed: true,
      hasZkSync: true,
    }

    let lastResponseClone: Response | undefined
    const fetchJestFn = jest.fn<
      Promise<Response>,
      [input: RequestInfo, init?: RequestInit | undefined]
    >((...args) =>
      fetchReal(...args).then((x) => {
        lastResponseClone = x.clone()
        return x
      }),
    )
    fetchMock.mockImplementation(fetchJestFn as any)

    const response = await fetchAns("graeme-goerli1")

    expect(response).toMatchObject(expectedResult)
    // fetch gets called once
    expect(fetchJestFn.mock.calls.length).toBe(1)
    // calls the right url
    expect(fetchJestFn.mock.calls[0]).toEqual([
      "https://cloud-test.argent-api.com/v1/wallet?ens=graeme-goerli1.argent.xyz",
    ])
    // gets correct api response
    const fetchResponse: Response = await fetchJestFn.mock.results[0].value
    expect(fetchResponse.status).toBe(200)
    await expect(lastResponseClone?.json()).resolves.toStrictEqual({
      deleted: false,
      ens: "graeme-goerli1.argent.xyz",
      l2: {
        walletStatus: [{ hasWallet: true, type: "ZK_SYNC", enabled: true }],
      },
      walletAddress: "0x3ea72d4967Bbcf2385D879D4FFeD51D9DDF5eD06",
      walletDeployed: true,
    })

    fetchMock.disableMocks()
  })
  it("doesnt work with wrong ans", async () => {
    const fetchReal = fetch

    fetchMock.enableMocks()

    const fetchJestFn = jest.fn(fetchReal)
    fetchMock.mockImplementation(fetchJestFn as any)

    await expect(fetchAns("404")).rejects.toThrowError("Not found")

    // fetch gets called once
    expect(fetchJestFn.mock.calls.length).toBe(1)
    // calls the right url
    expect(fetchJestFn.mock.calls[0]).toEqual([
      "https://cloud-test.argent-api.com/v1/wallet?ens=404.argent.xyz",
    ])
    // gets correct api response
    const fetchResponse: Response = await fetchJestFn.mock.results[0].value
    expect(fetchResponse.status).toBe(404)

    fetchMock.disableMocks()
  })
})

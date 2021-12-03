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
      ens: "janek.argent.xyz",
      walletAddress: "0x80c94441e9b3afc072c9a73d9a1db86fa0da7071",
      walletDeployed: true,
      l2: {
        walletStatus: [{ type: "ZK_SYNC", enabled: true, hasWallet: true }],
      },
    }
    const expectedResult: Ans = {
      ens: "janek.argent.xyz",
      walletAddress: "0x80c94441e9b3afc072c9a73d9a1db86fa0da7071",
      walletDeployed: true,
      hasZkSync: true,
      name: "janek",
    }
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse))

    const response = await fetchAns("janek")

    expect(response).toStrictEqual(expectedResult)
  })
  it("transforms 200 without zksync", async () => {
    const mockResponse: AnsResponse = {
      ens: "janek.argent.xyz",
      walletAddress: "0x80c94441e9b3afc072c9a73d9a1db86fa0da7071",
      walletDeployed: true,
      l2: {
        walletStatus: [{ type: "ZK_SYNC", enabled: false, hasWallet: true }],
      },
    }
    const expectedResult: Ans = {
      ens: "janek.argent.xyz",
      walletAddress: "0x80c94441e9b3afc072c9a73d9a1db86fa0da7071",
      walletDeployed: true,
      hasZkSync: false,
      name: "janek",
    }
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse))

    const response = await fetchAns("janek")

    expect(response).toStrictEqual(expectedResult)
  })
  it("throws on 404", async () => {
    fetchMock.mockOnce(async () => ({ status: 404, body: "" }))

    await expect(fetchAns("janek")).rejects.toThrowError("Not found")
  })
  it("throws on 500", async () => {
    fetchMock.mockOnce(async () => ({ status: 500, body: "" }))

    await expect(fetchAns("janek")).rejects.toThrowError("Request failed")
  })
})

describe("[int] ANS", () => {
  it("works with 'janek'", async () => {
    const fetchReal = fetch

    fetchMock.enableMocks()

    const expectedResult: Ans = {
      ens: "janek.argent.xyz",
      name: "janek",
      walletAddress: "0x80c94441e9b3afc072c9a73d9a1db86fa0da7071",
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

    const response = await fetchAns("janek")

    expect(response).toMatchObject(expectedResult)
    // fetch gets called once
    expect(fetchJestFn.mock.calls.length).toBe(1)
    // calls the right url
    expect(fetchJestFn.mock.calls[0]).toEqual([
      "https://cloud-test.argent-api.com/v1/wallet?ens=janek.argent.xyz",
    ])
    // gets correct api response
    const fetchResponse: Response = await fetchJestFn.mock.results[0].value
    expect(fetchResponse.status).toBe(200)
    await expect(lastResponseClone?.json()).resolves.toStrictEqual({
      deleted: false,
      ens: "janek.argent.xyz",
      l2: {
        walletStatus: [{ hasWallet: true, type: "ZK_SYNC", enabled: true }],
      },
      walletAddress: "0x80c94441e9b3afc072c9a73d9a1db86fa0da7071",
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

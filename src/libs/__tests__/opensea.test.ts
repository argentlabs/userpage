import fetchMock from "jest-fetch-mock"

import { AssetElement, OpenSeaResponse, fetchNfts } from "../opensea"

describe("[unit] Opensea", () => {
  beforeAll(() => {
    fetchMock.enableMocks()
  })
  beforeEach(() => {
    fetchMock.resetMocks()
  })
  afterAll(() => {
    fetchMock.disableMocks()
  })
  it("transforms 200", async () => {
    const mockResponse: OpenSeaResponse = {
      assets: [],
    }
    const expectedResult: AssetElement[] = []
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse))

    const { items } = await fetchNfts("address")

    expect(items).toStrictEqual(expectedResult)
  })
  it("throws on 404", async () => {
    fetchMock.mockOnce(async () => ({ status: 400, body: "" }))

    await expect(fetchNfts("janek")).rejects.toThrowError("Wrong address")
  })
  it("throws on 500", async () => {
    fetchMock.mockOnce(async () => ({ status: 500, body: "" }))

    await expect(fetchNfts("janek")).rejects.toThrowError("Request failed")
  })
})

describe("[int] Opensea", () => {
  it("works with '0xe75AFa985de4F013AccFc8b4Dd744551C6EEB5a9'", async () => {
    const fetchReal = fetch

    fetchMock.enableMocks()

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

    const { items } = await fetchNfts(
      "0xe75AFa985de4F013AccFc8b4Dd744551C6EEB5a9",
    )

    expect(items.map((x) => x.id)).toMatchSnapshot("fetchNfts")
    // fetch gets called once
    expect(fetchJestFn.mock.calls.length).toBe(1)
    // calls the right url
    expect(fetchJestFn.mock.calls[0][0]).toEqual(
      "https://api.opensea.io/api/v1/assets?owner=0xe75AFa985de4F013AccFc8b4Dd744551C6EEB5a9&order_direction=desc&offset=0&limit=50",
    )
    // gets correct api response
    const fetchResponse: Response = await fetchJestFn.mock.results[0].value
    expect(fetchResponse.status).toBe(200)
    await expect(
      lastResponseClone?.json().then((x) => x.assets.length),
    ).resolves.toBe(3)

    fetchMock.disableMocks()
  })
  it("doesnt work with wrong ans", async () => {
    const fetchReal = fetch

    fetchMock.enableMocks()

    const fetchJestFn = jest.fn(fetchReal)
    fetchMock.mockImplementation(fetchJestFn as any)

    await expect(fetchNfts("0x0")).rejects.toThrowError("Wrong address")

    // fetch gets called once
    expect(fetchJestFn.mock.calls.length).toBe(1)
    // calls the right url
    expect(fetchJestFn.mock.calls[0][0]).toEqual(
      "https://api.opensea.io/api/v1/assets?owner=0x0&order_direction=desc&offset=0&limit=50",
    )
    // gets correct api response
    const fetchResponse: Response = await fetchJestFn.mock.results[0].value
    expect(fetchResponse.status).toBe(400)

    fetchMock.disableMocks()
  })
})

import fetchMock from "jest-fetch-mock"

import {
  Config,
  ResultConfig,
  TokensZkSync,
  fetchConfig,
  fetchTokenList,
} from "../zksyncApi"
import {
  configApiResponseMock,
  tokensApiResponseMock,
} from "./__mocks__/zksyncApi.mock"

describe("[unit] ZKSYNC Api", () => {
  beforeAll(() => {
    fetchMock.enableMocks()
  })
  beforeEach(() => {
    fetchMock.resetMocks()
  })
  afterAll(() => {
    fetchMock.disableMocks()
  })
  describe("[unit] fetchConfig", () => {
    it("transforms 200", async () => {
      const mockResponse: Config = configApiResponseMock
      const expectedResult: ResultConfig = configApiResponseMock.result
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse))

      const response = await fetchConfig()

      expect(response).toStrictEqual(expectedResult)
    })
    it("throws on 404", async () => {
      fetchMock.mockOnce(async () => ({ status: 404, body: "" }))

      await expect(fetchConfig).rejects.toThrowError()
    })
    it("throws on 500", async () => {
      fetchMock.mockOnce(async () => ({ status: 500, body: "" }))

      await expect(fetchConfig).rejects.toThrowError()
    })
  })
  describe("[unit] fetchTokenList", () => {
    it("transforms 200", async () => {
      const mockResponse: TokensZkSync = tokensApiResponseMock
      const expectedResult = new Set(tokensApiResponseMock.result.list)
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse))

      const response = await fetchTokenList()

      // ignore token order
      expect(new Set(response)).toEqual(expectedResult)
    })
    it("throws on 404", async () => {
      fetchMock.mockOnce(async () => ({ status: 404, body: "" }))

      await expect(fetchConfig).rejects.toThrowError()
    })
    it("throws on 500", async () => {
      fetchMock.mockOnce(async () => ({ status: 500, body: "" }))

      await expect(fetchConfig).rejects.toThrowError()
    })
  })
})

describe("[int] ZKSYNC Api", () => {
  describe("[int] fetchConfig", () => {
    it("fetches", async () => {
      const fetchReal = fetch

      fetchMock.enableMocks()

      const expectedResult: ResultConfig = configApiResponseMock.result

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

      const response = await fetchConfig()

      expect(response).toStrictEqual(expectedResult)
      // fetch gets called once
      expect(fetchJestFn.mock.calls.length).toBe(1)
      // calls the right url
      expect(fetchJestFn.mock.calls[0]).toEqual([
        "https://ropsten-beta-api.zksync.io/api/v0.2/config",
      ])
      // gets correct api response
      const fetchResponse: Response = await fetchJestFn.mock.results[0].value
      expect(fetchResponse.status).toBe(200)
      expect((await lastResponseClone?.json()).result).toMatchSnapshot(
        "fetchConfig",
      )

      fetchMock.disableMocks()
    })
  })
  describe("[int] fetchTokenList", () => {
    it("fetches", async () => {
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

      const response = await fetchTokenList()

      expect(new Set(response)).toMatchSnapshot("fetchTokenListResponseSet")
      // fetch gets called once
      expect(fetchJestFn.mock.calls.length).toBe(1)
      // calls the right url
      expect(fetchJestFn.mock.calls[0]).toEqual([
        "https://ropsten-beta-api.zksync.io/api/v0.2/tokens?limit=100&from=latest&direction=older",
      ])
      // gets correct api response
      const fetchResponse: Response = await fetchJestFn.mock.results[0].value
      expect(fetchResponse.status).toBe(200)
      expect((await lastResponseClone?.json()).result).toMatchSnapshot(
        "fetchTokenList",
      )

      fetchMock.disableMocks()
    })
  })
})

export const configApiResponseMock = {
  request: {
    network: "ropsten",
    apiVersion: "v02",
    resource: "/api/v0.2/config",
    args: {},
    timestamp: "2021-08-13T13:10:36.091426984Z",
  },
  status: "success",
  error: null,
  result: {
    network: "ropsten",
    contract: "0x3a49f0f4cf80992976625e1af168f31a12ab5004",
    govContract: "0x80ddc394aa5eeaf20167156a0a1e547e6e42a067",
    depositConfirmations: 0,
    zksyncVersion: "contractV4",
  },
}

export const tokensApiResponseMock = {
  request: {
    network: "ropsten",
    apiVersion: "v02",
    resource: "/api/v0.2/tokens",
    args: { limit: "100", from: "latest", direction: "older" },
    timestamp: "2021-08-13T13:36:46.644520593Z",
  },
  status: "success",
  error: null,
  result: {
    list: [
      {
        id: 10,
        address: "0xb36b2e278f5f1980631ad10f693ab3e1bebd9f70",
        symbol: "MLTT",
        decimals: 18,
        enabledForFees: true,
      },
      {
        id: 9,
        address: "0x1b46bd2fc40030b6959a2d407f7d16f66afadd52",
        symbol: "BAT",
        decimals: 18,
        enabledForFees: true,
      },
      {
        id: 8,
        address: "0xc865bcbe4b6ef4b58a790052f2b51b4f06f586ac",
        symbol: "ZRX",
        decimals: 18,
        enabledForFees: true,
      },
      {
        id: 7,
        address: "0x6856ec11f56267e3326f536d0e9f36ec7f7d1498",
        symbol: "TUSD",
        decimals: 18,
        enabledForFees: true,
      },
      {
        id: 6,
        address: "0x16c550a97ad2ae12c0c8cf1cc3f8db4e0c45238f",
        symbol: "BUSD",
        decimals: 18,
        enabledForFees: true,
      },
      {
        id: 5,
        address: "0x7e317ceaa15fe7d5474349043332319c5f28cc11",
        symbol: "FSN",
        decimals: 18,
        enabledForFees: true,
      },
      {
        id: 4,
        address: "0x5ae45f7f17f0df0b24abe25a5522a9c9341ac04d",
        symbol: "OKB",
        decimals: 18,
        enabledForFees: true,
      },
      {
        id: 3,
        address: "0x793f38ae147852c37071684cdffc1ff7c87f7d07",
        symbol: "LINK",
        decimals: 18,
        enabledForFees: true,
      },
      {
        id: 2,
        address: "0x351714df444b8213f2c46aaa28829fc5a8921304",
        symbol: "DAI",
        decimals: 18,
        enabledForFees: true,
      },
      {
        id: 1,
        address: "0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad",
        symbol: "T",
        decimals: 18,
        enabledForFees: false,
      },
      {
        id: 0,
        address: "0x0000000000000000000000000000000000000000",
        symbol: "ETH",
        decimals: 18,
        enabledForFees: false,
      },
    ],
    pagination: { from: 10, limit: 100, direction: "older", count: 10 },
  },
}
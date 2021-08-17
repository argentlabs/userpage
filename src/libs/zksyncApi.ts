import joinUrl from "url-join"

const { REACT_APP_ZKSYNC_API_BASE } = process.env

const ZKSYNC_API_TOKENS_PATH = "tokens?limit=100&from=latest&direction=older"
const ZKSYNC_API_CONFIG_PATH = "config"

export interface TokensZkSync {
  request: Request
  status: string
  error: any
  result: Result
}

export interface Request {
  network: string
  apiVersion: string
  resource: string
  args:
    | {
        limit: string
        from: string
        direction: string
      }
    | {}
  timestamp: string
}

export interface Result {
  list: TokenZkSync[]
  pagination: Pagination
}

export interface TokenZkSync {
  id: number
  address: string
  symbol: string
  decimals: number
  enabledForFees: boolean
}

export interface Pagination {
  from: number
  limit: number
  direction: string
  count: number
}

export interface Config {
  request: Request
  status: string
  error: null
  result: ResultConfig
}

export interface ResultConfig {
  network: string
  contract: string
  govContract: string
  depositConfirmations: number
  zksyncVersion: string
}

const zkSyncApiTokensEndpoint = joinUrl(
  REACT_APP_ZKSYNC_API_BASE,
  ZKSYNC_API_TOKENS_PATH,
)
const zkSyncApiConfigEndpoint = joinUrl(
  REACT_APP_ZKSYNC_API_BASE,
  ZKSYNC_API_CONFIG_PATH,
)

export const fetchTokenList = async (): Promise<TokenZkSync[]> => {
  const response = await fetch(zkSyncApiTokensEndpoint)
  const tokens = (await response.json()) as TokensZkSync

  return tokens?.result?.list?.sort?.((a, b) => a.id - b.id)
}

export const fetchConfig = async (): Promise<ResultConfig> => {
  const response = await fetch(zkSyncApiConfigEndpoint)
  const tokens = (await response.json()) as Config

  return tokens?.result
}

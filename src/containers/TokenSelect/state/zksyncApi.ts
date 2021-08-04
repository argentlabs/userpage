export interface Tokens {
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
  timestamp: Date
}

export interface Result {
  list: List[]
  pagination: Pagination
}

export interface List {
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

const ZKSYNC_API_BASE = "https://ropsten-beta-api.zksync.io/api/v0.2"
const ZKSYNC_API_TOKENS_ENDPOINT = `${ZKSYNC_API_BASE}/tokens?limit=100&from=latest&direction=older`
const ZKSYNC_API_CONFIG_ENDPOINT = `${ZKSYNC_API_BASE}/config`

export const fetchTokenList = async (): Promise<List[]> => {
  const response = await fetch(ZKSYNC_API_TOKENS_ENDPOINT)
  const tokens = (await response.json()) as Tokens

  return tokens?.result?.list?.sort?.((a, b) => a.id - b.id)
}

export const fetchConfig = async (): Promise<ResultConfig> => {
  const response = await fetch(ZKSYNC_API_CONFIG_ENDPOINT)
  const tokens = (await response.json()) as Config

  return tokens?.result
}

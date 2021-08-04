export interface Tokens {
  request: Request
  status: string
  error: null
  result: Result
}

export interface Request {
  network: string
  apiVersion: string
  resource: string
  args: Args
  timestamp: Date
}

export interface Args {
  limit: string
  from: string
  direction: string
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

const ZKSYNC_API_ENDPOINT =
  "https://ropsten-beta-api.zksync.io/api/v0.2/tokens?limit=100&from=latest&direction=older"

export const fetchTokenList = async () => {
  const response = await fetch(ZKSYNC_API_ENDPOINT)
  const tokens = (await response.json()) as Tokens

  return tokens?.result?.list?.sort?.((a, b) => a.id - b.id)
}

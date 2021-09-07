import joinUrl from "url-join"

const { REACT_APP_ZKSYNC_API_BASE } = process.env

const ZKSYNC_API_TOKENS_PATH = "tokens?limit=100&from=latest&direction=older"
const ZKSYNC_API_CONFIG_PATH = "config"
const ZKSYNC_API_ACCOUNTS_PATH = "accounts"

export interface Tokens {
  request: Request
  status: string
  result: TokensResult
  error: Error | null
}

export interface Error {
  errorType: string
  code: number
  message: string
}

export interface Request {
  network: string
  apiVersion: string
  resource: string
  args: {}
  timestamp: string
}

export interface TokensResult {
  pagination: Pagination
  list: Token[]
}

export interface Token {
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
  result: ConfigResult
  error: Error | null
}

export interface ConfigResult {
  network: string
  contract: string
  govContract: string
  depositConfirmations: number
  zksyncVersion: string
}

export interface Account {
  request: Request
  status: string
  result: AccountResult
  error: Error | null
}

export interface AccountResult {
  accountId: number
  address: string
  nonce: number
  pubKeyHash: string
  lastUpdateInBlock: number
  balances: { [token: string]: number }
  accountType: string
  nfts: {}
  mintedNfts: {}
}

const zkSyncApiTokensEndpoint = joinUrl(
  REACT_APP_ZKSYNC_API_BASE,
  ZKSYNC_API_TOKENS_PATH,
)
const zkSyncApiConfigEndpoint = joinUrl(
  REACT_APP_ZKSYNC_API_BASE,
  ZKSYNC_API_CONFIG_PATH,
)
const getZkSyncApiAccountEndpoint = (
  accountIdOrAddress: string,
  stateType: "committed" | "finalized" = "committed",
): string =>
  joinUrl(
    REACT_APP_ZKSYNC_API_BASE,
    ZKSYNC_API_ACCOUNTS_PATH,
    accountIdOrAddress,
    stateType,
  )

export const fetchTokenList = async (): Promise<Token[]> => {
  const response = await fetch(zkSyncApiTokensEndpoint)
  const tokens = (await response.json()) as Tokens

  if (!tokens?.result?.list) throw Error("No response included")

  return tokens.result?.list?.sort?.((a, b) => a.id - b.id)
}

export const fetchConfig = async (): Promise<ConfigResult> => {
  const response = await fetch(zkSyncApiConfigEndpoint)
  const config = (await response.json()) as Config

  if (!config?.result) throw Error("No response included")

  return config.result
}

export const fetchAccount = async (
  accountIdOrAddress: string,
  stateType: "committed" | "finalized" = "committed",
): Promise<AccountResult> => {
  const response = await fetch(
    getZkSyncApiAccountEndpoint(accountIdOrAddress, stateType),
  )
  const account = (await response.json()) as Account

  if (!account?.result) throw Error("No response included")

  return account.result
}

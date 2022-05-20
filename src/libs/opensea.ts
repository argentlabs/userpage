import { EMPTY, Observable, concat, defer, from, mergeMap } from "rxjs"
import joinUrl from "url-join"

export interface OpenSeaResponse {
  assets: AssetElement[]
}

export interface AssetElement {
  id: number
  token_id: string
  num_sales: number
  background_color: null
  image_url: string
  image_preview_url: string
  image_thumbnail_url: string
  image_original_url: null | string
  animation_url: null
  animation_original_url: null
  name: string
  description: null | string
  external_link: null | string
  asset_contract: AssetContract
  permalink: string
  collection: Collection
  decimals: number | null
  token_metadata: null | string
  owner: Creator
  sell_orders: SellOrder[] | null
  creator: Creator
  traits: Trait[]
  last_sale: null
  top_bid: null
  listing_date: null
  is_presale: boolean
  transfer_fee_payment_token: null
  transfer_fee: null
}

export interface AssetContract {
  address: string
  asset_contract_type: string
  created_date: Date
  name: string
  nft_version: null | string
  opensea_version: null | string
  owner: number
  schema_name: string
  symbol: string
  total_supply: null | string
  description: null | string
  external_link: null | string
  image_url: null | string
  default_to_fiat: boolean
  dev_buyer_fee_basis_points: number
  dev_seller_fee_basis_points: number
  only_proxied_transfers: boolean
  opensea_buyer_fee_basis_points: number
  opensea_seller_fee_basis_points: number
  buyer_fee_basis_points: number
  seller_fee_basis_points: number
  payout_address: null
}

export interface Collection {
  banner_image_url: null | string
  chat_url: null
  created_date: Date
  default_to_fiat: boolean
  description: null | string
  dev_buyer_fee_basis_points: string
  dev_seller_fee_basis_points: string
  discord_url: null | string
  display_data: DisplayData
  external_url: null | string
  featured: boolean
  featured_image_url: null | string
  hidden: boolean
  safelist_request_status: string
  image_url: null | string
  is_subject_to_whitelist: boolean
  large_image_url: null | string
  medium_username: null | string
  name: string
  only_proxied_transfers: boolean
  opensea_buyer_fee_basis_points: string
  opensea_seller_fee_basis_points: string
  payout_address: null | string
  require_email: boolean
  short_description: null
  slug: string
  telegram_url: null | string
  twitter_username: null | string
  instagram_username: null | string
  wiki_url: null
}

export interface DisplayData {
  card_display_style: string
  images?: any[]
}

export interface Creator {
  user: User | null
  profile_img_url: string
  address: string
  config: string
}

export interface User {
  username: null | string
}

export interface SellOrder {
  created_date: Date
  closing_date: null
  closing_extendable: boolean
  expiration_time: number
  listing_time: number
  order_hash: string
  metadata: Metadata
  exchange: string
  maker: FeeRecipient
  taker: FeeRecipient
  current_price: string
  current_bounty: string
  bounty_multiple: string
  maker_relayer_fee: string
  taker_relayer_fee: string
  maker_protocol_fee: string
  taker_protocol_fee: string
  maker_referrer_fee: string
  fee_recipient: FeeRecipient
  fee_method: number
  side: number
  sale_kind: number
  target: string
  how_to_call: number
  calldata: string
  replacement_pattern: string
  static_target: string
  static_extradata: string
  payment_token: string
  payment_token_contract: PaymentTokenContract
  base_price: string
  extra: string
  quantity: string
  salt: string
  v: number
  r: string
  s: string
  approved_on_chain: boolean
  cancelled: boolean
  finalized: boolean
  marked_invalid: boolean
  prefixed_hash: string
}

export interface FeeRecipient {
  user: number
  profile_img_url: string
  address: string
  config: string
}

export interface Metadata {
  asset: MetadataAsset
  schema: string
}

export interface MetadataAsset {
  id: string
  address: string
  quantity: string
}

export interface PaymentTokenContract {
  id: number
  symbol: string
  address: string
  image_url: string
  name: string
  decimals: number
  eth_price: string
  usd_price: string
}

export interface Trait {
  trait_type: string
  value: string
  display_type: null
  max_value: null
  trait_count: number
  order: null
}

export const getNftMediaUrl = (
  nft?: AssetElement,
  detailView: boolean = false,
): string =>
  detailView
    ? nft?.animation_url ||
      nft?.animation_original_url ||
      nft?.image_url ||
      nft?.image_original_url ||
      nft?.image_preview_url ||
      nft?.image_thumbnail_url ||
      "error"
    : nft?.animation_url ||
      nft?.animation_original_url ||
      nft?.image_url ||
      nft?.image_original_url ||
      nft?.image_preview_url ||
      nft?.image_thumbnail_url ||
      "error"

const getFirstFetchUrl = async (
  sourcesToTry: (string | null | undefined)[],
): Promise<Blob> => {
  for (const source of sourcesToTry) {
    if (source) {
      const response = await fetch(source)
      if (response.ok) {
        return response.blob()
      }
    }
  }

  throw new Error("no src was valid")
}

export const getNftMedia = async (nft?: AssetElement): Promise<Blob> => {
  const srcesToTry = [
    nft?.animation_url,
    nft?.animation_original_url,
    nft?.image_url,
    nft?.image_original_url,
    nft?.image_preview_url,
    nft?.image_thumbnail_url,
  ]

  return getFirstFetchUrl(srcesToTry)
}

export const getPosterMedia = async (nft?: AssetElement): Promise<Blob> => {
  const srcesToTry = [
    nft?.image_url,
    nft?.image_preview_url,
    nft?.image_thumbnail_url,
    nft?.image_original_url,
  ]

  return getFirstFetchUrl(srcesToTry)
}

const {
  REACT_APP_OPENSEA_ENDPOINT = "https://api.opensea.io/api/v1/assets",
  REACT_APP_OPENSEA_API_KEY,
} = process.env

const urlCache = new WeakMap()
export const getBlobUrl = (blob: Blob): string => {
  if (urlCache.has(blob)) {
    return urlCache.get(blob)
  } else {
    const url = URL.createObjectURL(blob)
    urlCache.set(blob, url)
    return url
  }
}

export const fetchAllNfts = (account: string, offset: number = 0) =>
  defer(() => fetchNfts(account, offset)).pipe(
    mergeMap(({ items, limit, offset }) => {
      const items$ = from(items)
      const next$: Observable<AssetElement> =
        items.length === limit ? fetchAllNfts(account, offset + limit) : EMPTY
      if (items.length < limit) offset = 0
      return concat(items$, next$)
    }),
  )

export const fetchNfts = async (
  address: string,
  offset: number = 0,
): Promise<{ items: AssetElement[]; offset: number; limit: number }> => {
  const limit = 50
  const response = await fetch(
    joinUrl(
      REACT_APP_OPENSEA_ENDPOINT,
      `?owner=${address}&order_direction=desc&offset=${offset}&limit=${50}`,
    ),
    {
      headers: {
        ...(REACT_APP_OPENSEA_API_KEY && {
          "X-API-KEY": REACT_APP_OPENSEA_API_KEY,
        }),
      },
    },
  )

  if (response.status === 400) throw Error("Wrong address")
  if (response.status >= 400) throw Error("Request failed")

  const nfts = (await response.json()) as OpenSeaResponse

  return { items: nfts.assets, offset, limit }
}

export const fetchNft = async (
  tokenId: string,
  assetContractAddress: string,
): Promise<AssetElement> => {
  const response = await fetch(
    joinUrl(
      REACT_APP_OPENSEA_ENDPOINT,
      `?token_ids=${tokenId}&asset_contract_address=${assetContractAddress}&order_direction=desc&offset=0&limit=1`,
    ),
    {
      headers: {
        ...(REACT_APP_OPENSEA_API_KEY && {
          "X-API-KEY": REACT_APP_OPENSEA_API_KEY,
        }),
      },
    },
  )

  if (response.status === 400) throw Error("Wrong address")
  if (response.status >= 400) throw Error("Request failed")

  const nfts = (await response.json()) as OpenSeaResponse

  return nfts.assets[0]
}

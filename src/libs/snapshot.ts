import { gql, request } from "graphql-request"

export const tokenAddressBySpace = {
  "aave.eth": "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
  "curve.eth": "0xD533a949740bb3306d119CC777fa900bA034cd52",
  uniswap: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  "ens.eth": "0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72",
  "gitcoindao.eth": "0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F",
  "sushigov.eth": "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2",
  "banklessvault.eth": "0x2d94AA3e47d9D5024503Ca8491fcE9A2fB4DA198",
  "snapshot.dcl.eth": "0x0F5D2fB29fb7d3CFeE444a200298f468908cC942",
  "dydxgov.eth": "0x92D6C1e31e14520e676a687F0a93788B716BEff5",
  "balancer.eth": "0xba100000625a3754423978a60c9317c58a424e3D",
  "graphprotocol.eth": "0xc944E90C64B2c07662A292be6244BDf05Cda44a7",
  "1inch.eth": "0x111111111117dc0aa78b770fa6a738034120c302",
  "lrctoken.eth": "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD",
}

type SupportedSpaces = keyof typeof tokenAddressBySpace
export const supportedSpaces = Object.keys(
  tokenAddressBySpace,
) as SupportedSpaces[]

export interface Proposal {
  id: string
  space: {
    id: SupportedSpaces
    avatar: string
    name: string
  }
  title: string
  body: string
  start: number
  end: number
  state: "active" | "closed"
  votes: number
  link: string
}

interface GetProposalsByStateResponseData {
  proposals: Proposal[]
}

interface QueryVariables {
  state: "active" | "closed"
  spaces: SupportedSpaces[]
  orderDirection: "desc" | "asc"
  limit: number
}

export async function getProposalsByState(
  state: "active" | "closed",
  spaces: SupportedSpaces[] = supportedSpaces,
) {
  const query = gql`
    query getProposalsByState(
      $state: String
      $spaces: [String]
      $orderDirection: OrderDirection
      $limit: Int
    ) {
      proposals(
        where: { space_in: $spaces, state: $state }
        orderBy: "end"
        orderDirection: $orderDirection
        first: $limit
      ) {
        id
        space {
          id
          avatar
          name
        }
        title
        body
        start
        end
        state
        votes
        link
      }
    }
  `
  const variables: QueryVariables = {
    state,
    spaces,
    orderDirection: state === "closed" ? "desc" : "asc",
    limit: 20,
  }
  const response = await request<
    GetProposalsByStateResponseData,
    QueryVariables
  >("https://hub.snapshot.org/graphql", query, variables)

  return response.proposals
}

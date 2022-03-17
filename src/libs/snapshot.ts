import { gql, request } from "graphql-request"

export const tokenAddressBySpace = {
  "aave.eth": "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
  "curve.eth": "0xD533a949740bb3306d119CC777fa900bA034cd52",
  uniswap: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
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
  state: string
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

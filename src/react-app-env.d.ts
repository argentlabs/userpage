/// <reference types="react-scripts" />

declare namespace NodeJS {
  export interface ProcessEnv {
    REACT_APP_DESIRED_NETWORK_ID: string
    REACT_APP_INFURA_KEY: string
    REACT_APP_ZKSYNC_API_BASE: string
    REACT_APP_ARGENT_API_ANS_WALLET_ENDPOINT: string

    REACT_APP_ARGENT_DETECTOR_CONTRACT_ADDRESS: string
    REACT_APP_MULTICALL_CONTRACT_ADDRESS: string

    REACT_APP_APP_NAME?: string
    REACT_APP_APP_URL?: string
    REACT_APP_CONTACT_EMAIL?: string
  }
}

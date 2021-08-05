import { useMachine } from "@xstate/react"
import { ethers } from "ethers"
import { FC, useMemo } from "react"
import { State } from "xstate"

import AmountInput from "../../components/AmountInput"
import ArgentLogo from "../../components/ArgentLogo"
import Avatar from "../../components/Avatar"
import Button from "../../components/Button"
import Center from "../../components/Center"
import PageWrapper from "../../components/PageWrapper"
import Box from "../../components/ProfileBox"
import TokenSelect from "../../containers/TokenSelect"
import { useAnsStore } from "../../libs/ans"
import { getTransactionExplorerUrl } from "../../libs/web3"
import { ButtonWrapper, InputWrapper } from "./Send.style"
import { ValueType, sendMaschine, useTxStore } from "./state"

const showConnectScreenValues: Array<ValueType> = ["readyToPair", "pairing"]
const showConnectScreen = (state: State<any, any>) =>
  showConnectScreenValues.some(state.matches)

const showAmountScreenValues: Array<ValueType> = ["approve", "send"]
const showAmountScreen = (state: State<any, any>) =>
  showAmountScreenValues.some(state.matches)

const showLoadingScreenValues: Array<ValueType> = ["sending", "approving"]
const showLoadingScreen = (state: State<any, any>) =>
  showLoadingScreenValues.some(state.matches)

const showSuccessScreenValues: Array<ValueType> = ["success"]
const showSuccessScreen = (state: State<any, any>) =>
  showSuccessScreenValues.some(state.matches)

const showErrorScreenValues: Array<ValueType> = ["error"]
const showErrorScreen = (state: State<any, any>) =>
  showErrorScreenValues.some(state.matches)

export const SendPage: FC = () => {
  const [state, send] = useMachine(sendMaschine)
  const tx = useTxStore()
  const ans = useAnsStore()
  const explorerUrl = useMemo(() => getTransactionExplorerUrl(tx), [tx])

  const { amount, contract, tokens } = state.context

  const selectedToken = tokens.find((x) => x.address === contract)
  const disableButton =
    !amount ||
    selectedToken?.balance.lt(
      ethers.utils.parseUnits(amount, selectedToken?.decimals),
    )
  const textButton = state.matches("send")
    ? "Send"
    : // "approve" left
      "Pre-authorize tokens"

  return (
    <PageWrapper>
      <ArgentLogo />
      <Center>
        <Avatar />
        <Box
          lean
          title={showConnectScreen(state) ? "Sent to" : undefined}
          subtitle={ans.ens}
        >
          {showConnectScreen(state) && (
            <ButtonWrapper>
              <Button fullWidth onClick={() => send("START_PAIR")}>
                Connect a wallet
              </Button>
              <Button fullWidth>Pay with card/bank</Button>
            </ButtonWrapper>
          )}
          {showAmountScreen(state) && (
            <InputWrapper>
              <AmountInput
                placeholder="0.00"
                value={amount}
                onChange={(value) =>
                  send({ type: "CHANGE_CONTEXT", amount: value })
                }
              />
              <TokenSelect
                value={contract}
                onResponse={(tokens) => send({ type: "CHANGE_TOKENS", tokens })}
                onChange={(token) =>
                  send({ type: "CHANGE_CONTEXT", contract: token.address })
                }
              />
              <Button
                disabled={disableButton}
                onClick={async () => {
                  if (state.matches("approve")) {
                    send("SEND_APPROVE")
                  }
                  if (state.matches("send")) {
                    send("SEND_TRANSACTION")
                  }
                }}
              >
                {textButton}
              </Button>
            </InputWrapper>
          )}
          {showLoadingScreen(state) && <p>{explorerUrl}</p>}
          {showErrorScreen(state) && <p>error</p>}
          {showSuccessScreen(state) && <p>success</p>}
        </Box>
      </Center>
    </PageWrapper>
  )
}

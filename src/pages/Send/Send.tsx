import { useMachine } from "@xstate/react"
import { ethers } from "ethers"
import { FC, useEffect, useMemo, useState } from "react"
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
import loadingAnimation from "./animations/spinner.json"
import successAnimation from "./animations/success.json"
import {
  ButtonWrapper,
  EtherscanLink,
  InputWrapper,
  SLottie,
} from "./Send.style"
import { ValueType, sendMaschine, useTxStore } from "./state"

const showConnectScreenValues: Array<ValueType> = ["readyToPair", "pairing"]
const showConnectScreen = (state: State<any, any>) =>
  showConnectScreenValues.some(state.matches)

const showAmountScreenValues: Array<ValueType> = ["approve", "send"]
const showAmountScreen = (state: State<any, any>) =>
  showAmountScreenValues.some(state.matches)

const showLoadingOrSuccessScreenValues: Array<ValueType> = [
  "sending",
  "approving",
  "success",
]
const showLoadingOrSuccessScreen = (state: State<any, any>) =>
  showLoadingOrSuccessScreenValues.some(state.matches)

const showInFlightScreenValues: Array<ValueType> = ["sending", "approving"]
const showInFlightScreen = (state: State<any, any>) =>
  showInFlightScreenValues.some(state.matches)

const showErrorScreenValues: Array<ValueType> = ["error"]
const showErrorScreen = (state: State<any, any>) =>
  showErrorScreenValues.some(state.matches)

export const SendPage: FC = () => {
  const [state, send] = useMachine(sendMaschine)
  const tx = useTxStore()
  const ans = useAnsStore()
  const [showLoadingState, setShowLoadingState] = useState<
    "init" | "loading" | "success"
  >("init")

  useEffect(() => {
    if (showInFlightScreen(state) && showLoadingState === "init") {
      setShowLoadingState("loading")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.value])

  const explorerUrl = useMemo(() => getTransactionExplorerUrl(tx), [tx])
  console.log(state.value)
  console.log(showLoadingState)
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
          subtitle={
            showLoadingState === "loading" || showLoadingState === "success"
              ? showLoadingState === "success"
                ? state.matches("success")
                  ? "Sent!"
                  : "Approved!"
                : explorerUrl
                ? "Pending..."
                : "Waiting for signature..."
              : ans.ens
          }
        >
          {showLoadingState === "loading" || showLoadingState === "success" ? (
            <>
              <SLottie
                onLoopComplete={() => {
                  if (
                    state.matches("success") &&
                    showLoadingState !== "success"
                  ) {
                    setShowLoadingState("success")
                  }
                  if (!showLoadingOrSuccessScreen(state)) {
                    if (showLoadingState === "success") {
                      setShowLoadingState("init")
                    } else if (showLoadingState === "loading") {
                      setShowLoadingState("success")
                    }
                  }
                }}
                onComplete={() => {
                  if (!showLoadingOrSuccessScreen(state)) {
                    if (showLoadingState === "success") {
                      setShowLoadingState("init")
                    } else if (showLoadingState === "loading") {
                      setShowLoadingState("success")
                    }
                  }
                }}
                animationData={
                  showLoadingState === "success"
                    ? successAnimation
                    : loadingAnimation
                }
                loop={showLoadingState !== "success"}
                initialSegment={
                  showLoadingState === "success" ? [0, 95] : undefined
                }
              />
              {explorerUrl && (
                <EtherscanLink href={explorerUrl} target="_blank">
                  View on Etherscan
                </EtherscanLink>
              )}
            </>
          ) : (
            <>
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
                    onResponse={(tokens) =>
                      send({ type: "CHANGE_TOKENS", tokens })
                    }
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
            </>
          )}
          {showErrorScreen(state) && <p>error</p>}
        </Box>
      </Center>
    </PageWrapper>
  )
}

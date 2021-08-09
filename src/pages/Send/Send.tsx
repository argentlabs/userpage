import { useMachine } from "@xstate/react"
import { ethers } from "ethers"
import { FC, useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { State } from "xstate"

import loadingAnimation from "../../animations/spinner.json"
import successAnimation from "../../animations/success.json"
import AmountInput from "../../components/AmountInput"
import ArgentLogo from "../../components/ArgentLogo"
import Avatar from "../../components/Avatar"
import Button, { SecondaryButton } from "../../components/Button"
import Center from "../../components/Center"
import PageWrapper from "../../components/PageWrapper"
import Box from "../../components/ProfileBox"
import TokenSelect from "../../containers/TokenSelect"
import { useAnsStore } from "../../libs/ans"
import { getTransactionExplorerUrl } from "../../libs/web3"
import {
  ButtonWrapper,
  ExternalLink,
  InputWrapper,
  LottieWrapper,
  MetaText,
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

const overwriteableScreenValues: Array<ValueType> = [
  ...showAmountScreenValues,
  ...showLoadingOrSuccessScreenValues,
  "error",
]
const overwriteableScreens = (state: State<any, any>) =>
  overwriteableScreenValues.some(state.matches)

const showInFlightScreenValues: Array<ValueType> = ["sending", "approving"]
const showInFlightScreen = (state: State<any, any>) =>
  showInFlightScreenValues.some(state.matches)

export const SendPage: FC = () => {
  const [state, send] = useMachine(sendMaschine)
  const tx = useTxStore()
  const ans = useAnsStore()
  const [showLoadingState, setShowLoadingState] = useState<
    "init" | "loading" | "success" | "error"
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
  const { amount, contract, tokens, errored } = state.context

  const selectedToken = tokens.find((x) => x.address === contract)
  const disableButton =
    !amount ||
    amount === "0" ||
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
          goBackButtonTo={showLoadingState === "init" ? "/" : undefined}
          title={showConnectScreen(state) ? "Add funds to" : undefined}
          tinyTitle={
            showLoadingState !== "init"
              ? showLoadingState === "success"
                ? state.matches("success")
                  ? "Sent!"
                  : "Approved!"
                : showLoadingState === "error"
                ? "Something went wrong"
                : explorerUrl
                ? "Pending..."
                : "Waiting for signature..."
              : undefined
          }
          subtitle={showLoadingState !== "init" ? undefined : ans.ens}
        >
          {overwriteableScreens(state) && showLoadingState !== "init" ? (
            <LottieWrapper>
              <SLottie
                onLoopComplete={() => {
                  if (
                    state.matches("success") &&
                    showLoadingState !== "success"
                  ) {
                    setShowLoadingState("success")
                  }
                  if (state.matches("error") && showLoadingState !== "error") {
                    setShowLoadingState("error")
                  }
                  if (!showLoadingOrSuccessScreen(state)) {
                    if (
                      showLoadingState === "success" ||
                      errored // meta mask denied
                    ) {
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
                // TODO: add error animation
                animationData={
                  showLoadingState === "success"
                    ? successAnimation
                    : loadingAnimation
                }
                loop={showLoadingState === "loading"}
                initialSegment={
                  showLoadingState === "success" ? [0, 95] : undefined
                }
              />
              {explorerUrl && (
                <ExternalLink href={explorerUrl} target="_blank">
                  View on Etherscan
                </ExternalLink>
              )}
              {((showLoadingState === "success" && state.matches("success")) ||
                (showLoadingState === "error" && state.matches("error"))) && (
                <SecondaryButton as={Link} to="/">
                  Start over
                </SecondaryButton>
              )}
            </LottieWrapper>
          ) : (
            <>
              {showConnectScreen(state) && (
                <ButtonWrapper>
                  <Button fullWidth onClick={() => send("START_PAIR")}>
                    Connect a wallet
                  </Button>
                  <Button fullWidth>Pay with card/bank</Button>
                  <MetaText>Funds are sent to their zkSync account</MetaText>
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
                  <MetaText invisible={state.matches("send")}>
                    Pre-authorization required before sending
                  </MetaText>
                </InputWrapper>
              )}
            </>
          )}
        </Box>
      </Center>
    </PageWrapper>
  )
}

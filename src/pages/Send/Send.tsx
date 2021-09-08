import { ethers } from "ethers"
import { FC, useEffect, useMemo, useState } from "react"
import { Helmet } from "react-helmet"

import loadingAnimation from "../../animations/spinner.json"
import successAnimation from "../../animations/success.json"
import errorAnimation from "../../animations/transaction-fail.json"
import AmountInput from "../../components/AmountInput"
import ArgentLogo from "../../components/ArgentLogo"
import Avatar from "../../components/Avatar"
import Button, { SecondaryButton } from "../../components/Button"
import Center from "../../components/Center"
import DarkmodeSwitch from "../../components/DarkmodeSwitch"
import PageWrapper from "../../components/PageWrapper"
import Box from "../../components/ProfileBox"
import TokenSelect from "../../containers/TokenSelect"
import { getTransactionExplorerUrl, networkId } from "../../libs/web3"
import { useRouterMachine, useSendMachine } from "../../states/hooks"
import {
  amountScreens,
  connectScreens,
  inFlightScreens,
  notOverwriteableScreens,
  stateMatchesFactory,
} from "./helper"
import {
  ButtonWrapper,
  ExternalLink,
  InputWrapper,
  LottieWrapper,
  MetaText,
  NotMainnetDisclaimer,
  SLottie,
} from "./Send.style"

type AnimationState = "idle" | "loading" | "error" | "success"

export const SendPage: FC = () => {
  /** Non production state */
  const [hideNotMainnetDisclaimer, setHideNotMainnetDisclaimer] =
    useState(false)
  /** STATE MACHINES */
  // Router Machine
  const [stateRouter, sendRouter] = useRouterMachine()
  const { ens, name, walletAddress } = stateRouter.context
  // Send Machine
  const [state, send] = useSendMachine()
  const { amount, contract, tokens, transactionHash, hasZkSync } = state.context

  /** HELPER */
  // Animation helper hook
  const [loadingState, setLoadingState] = useState<AnimationState>("idle")
  useEffect(() => {
    // reset loading state when on non overwriteable screen
    if (stateMatches(notOverwriteableScreens)) {
      setLoadingState("idle")
    }
    // get loading animation running when required
    if (stateMatches(inFlightScreens) && loadingState === "idle") {
      setLoadingState("loading")
    } else if (state.matches("error") && loadingState === "idle") {
      setLoadingState("error")
    }
  }, [state.value])
  // get explorerUrl when transactionHash is provided
  const explorerUrl = useMemo(
    () => getTransactionExplorerUrl({ hash: transactionHash || "" }),
    [transactionHash],
  )
  // helper function to check state matches
  const stateMatches = stateMatchesFactory(state)

  /** UI CONTROL */
  const selectedToken = tokens.find((x) => x.address === contract)
  // disable approve/send button if invalid amount or not enough balance
  const disableButton =
    // invalid input
    !amount ||
    amount === "0" ||
    // check balance is gte amount
    selectedToken?.balance.lt(
      ethers.utils.parseUnits(amount, selectedToken?.decimals),
    )

  // button can ether be used for approval or to send
  const textButton = state.matches("approve") ? "Pre-authorize tokens" : "Send"

  // title is shown when connecting the wallet
  const title = stateMatches(connectScreens) ? "Add funds to" : undefined

  // subtitle and backButton are shown when there is no animation on screen
  const subTitle = loadingState === "idle" ? ens || name : undefined
  const onBackButtonClick =
    loadingState === "idle" ? () => sendRouter("PUSH_HOME") : undefined

  // tiny title, used in animation screens
  const tinyTitle =
    loadingState !== "idle" // if loading screen isnt shown, dont show tinyTitle
      ? loadingState === "success" //animation shows success
        ? state.matches("success") // actual state is success
          ? "Sent!"
          : "Approved!" // animation shows success and actual state isnt success yet = approved
        : loadingState === "error" //check if animation shows error
        ? "Something went wrong"
        : explorerUrl //if tx hash is there, show explorer tx url
        ? "Pending..."
        : state.matches("ramp")
        ? "Waiting for Ramp..."
        : "Waiting for signature..." // last case left is that we're waiting for metamask to approve
      : undefined

  // swap animations based on loading state
  const animationData =
    loadingState === "success"
      ? successAnimation
      : loadingState === "error"
      ? errorAnimation
      : loadingAnimation

  // determines if the animation should loop
  const isLooping = loadingState === "loading"

  //determines which frames of the animation get played (default: all)
  const initialSegment: [number, number] | undefined =
    loadingState === "loading" ? undefined : [0, 95]

  return (
    <PageWrapper>
      <DarkmodeSwitch />
      <Helmet>
        <title>{state.matches("pairing") ? ens : `Send - ${ens}`}</title>
      </Helmet>
      <ArgentLogo />
      <Center>
        <Avatar pubkey={walletAddress} />
        <Box
          lean
          onBackButtonClick={onBackButtonClick}
          title={title}
          tinyTitle={tinyTitle}
          subtitle={subTitle}
        >
          {
            // when animations are running, show them
            loadingState !== "idle" ? (
              <LottieWrapper>
                <SLottie
                  onLoopComplete={() => {
                    if (
                      state.matches("success") &&
                      loadingState !== "success"
                    ) {
                      setLoadingState("success")
                    }
                    if (state.matches("error") && loadingState !== "error") {
                      return setLoadingState("error")
                    }
                    if (stateMatches(amountScreens)) {
                      if (loadingState === "success") {
                        setLoadingState("idle")
                      } else if (loadingState === "loading") {
                        if (state.event?.type?.includes?.("error")) {
                          // metamask denied
                          setLoadingState("idle")
                        } else {
                          setLoadingState("success")
                        }
                      }
                    }
                  }}
                  onComplete={() => {
                    if (stateMatches(amountScreens)) {
                      if (loadingState === "success") {
                        setLoadingState("idle")
                      } else if (loadingState === "loading") {
                        setLoadingState("success")
                      }
                    }
                  }}
                  animationData={animationData}
                  loop={isLooping}
                  initialSegment={initialSegment}
                />
                {
                  // if explorerUrl exists, show it
                  explorerUrl && (
                    <ExternalLink href={explorerUrl} target="_blank">
                      View on Etherscan
                    </ExternalLink>
                  )
                }
                {
                  // on error or success state, show "Start over" button
                  ((loadingState === "success" && state.matches("success")) ||
                    (loadingState === "error" && state.matches("error"))) && (
                    <SecondaryButton onClick={() => sendRouter("PUSH_HOME")}>
                      Start over
                    </SecondaryButton>
                  )
                }
              </LottieWrapper>
            ) : (
              // if no animation is running, show another screen
              <>
                {
                  // Connect you Wallet
                  stateMatches(connectScreens) && (
                    <ButtonWrapper>
                      <Button fullWidth onClick={() => send("START_PAIR")}>
                        Connect a wallet
                      </Button>
                      <Button fullWidth onClick={() => send("START_RAMP")}>
                        Pay with card/bank
                      </Button>
                      <MetaText red={!hasZkSync}>
                        {hasZkSync
                          ? "Funds are sent to their zkSync account"
                          : "Funds are transfered on Ethereum Mainnet"}
                      </MetaText>
                    </ButtonWrapper>
                  )
                }
                {
                  //Put in some amount and the token/coin you want to send
                  stateMatches(amountScreens) && (
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
                        onChange={(token) =>
                          send({
                            type: "CHANGE_CONTEXT",
                            contract: token.address,
                          })
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
                      <MetaText invisible={!state.matches("approve")}>
                        Pre-authorization required before sending
                      </MetaText>
                    </InputWrapper>
                  )
                }
              </>
            )
          }
        </Box>
      </Center>
      {
        // warning for non mainnet bank purchases
        networkId !== 1 &&
          state.matches("ramp") &&
          !hideNotMainnetDisclaimer && (
            <NotMainnetDisclaimer
              onClick={() => setHideNotMainnetDisclaimer(true)}
            >
              You are not using Ethereum Mainnet!
            </NotMainnetDisclaimer>
          )
      }
    </PageWrapper>
  )
}

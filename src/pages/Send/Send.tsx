import { useMachine } from "@xstate/react"
import { FC } from "react"
import { State } from "xstate"

import ArgentLogo from "../../components/ArgentLogo"
import Avatar from "../../components/Avatar"
import Button from "../../components/Button"
import Center from "../../components/Center"
import PageWrapper from "../../components/PageWrapper"
import Box from "../../components/ProfileBox"
import { onboard } from "../../libs/web3"
import { ButtonWrapper, InputWrapper } from "./Send.style"
import { ValueType, sendMaschine } from "./state"

const showConnectScreenValues: Array<ValueType> = ["readyToPair", "pairing"]
const showConnectScreen = (state: State<any, any>) =>
  showConnectScreenValues.some(state.matches)

const showAmountScreenValues: Array<ValueType> = ["paired"]
const showAmountScreen = (state: State<any, any>) =>
  showAmountScreenValues.some(state.matches)

export const SendPage: FC = () => {
  const [state, send] = useMachine(sendMaschine)

  const pair = async () => {
    send("START_PAIR")
    try {
      await onboard.walletSelect()
      await onboard.walletCheck()
      send("PAIR_SUCCESS")
    } catch {
      send("PAIR_ERROR")
    }
  }

  console.log(state.value)

  return (
    <PageWrapper>
      <ArgentLogo />
      <Center>
        <Avatar />
        <Box
          lean
          title={showConnectScreen(state) ? "Sent to" : undefined}
          subtitle="graeme.argent.xyz"
        >
          {showConnectScreen(state) && (
            <ButtonWrapper>
              <Button fullWidth onClick={pair}>
                Connect a wallet
              </Button>
              <Button fullWidth>Pay with card/bank</Button>
            </ButtonWrapper>
          )}
          {showAmountScreen(state) && <InputWrapper>Amount</InputWrapper>}
        </Box>
      </Center>
    </PageWrapper>
  )
}

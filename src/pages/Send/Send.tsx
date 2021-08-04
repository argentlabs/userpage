import { useMachine } from "@xstate/react"
import { FC, useState } from "react"
import { State } from "xstate"

import AmountInput from "../../components/AmountInput"
import ArgentLogo from "../../components/ArgentLogo"
import Avatar from "../../components/Avatar"
import Button from "../../components/Button"
import Center from "../../components/Center"
import PageWrapper from "../../components/PageWrapper"
import Box from "../../components/ProfileBox"
import TokenSelect from "../../containers/TokenSelect"
import { ButtonWrapper, InputWrapper } from "./Send.style"
import { ValueType, sendMaschine } from "./state"

const showConnectScreenValues: Array<ValueType> = ["readyToPair", "pairing"]
const showConnectScreen = (state: State<any, any>) =>
  showConnectScreenValues.some(state.matches)

const showAmountScreenValues: Array<ValueType> = [
  "paired",
  "approve",
  "approving",
  "send",
]
const showAmountScreen = (state: State<any, any>) =>
  showAmountScreenValues.some(state.matches)

export const SendPage: FC = () => {
  const [state, send] = useMachine(sendMaschine)

  const [amount, setAmount] = useState("")

  const pair = async () => {
    send("START_PAIR")
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
          {showAmountScreen(state) && (
            <InputWrapper>
              <AmountInput
                placeholder="0.00"
                value={amount}
                onChange={(value) => setAmount(value)}
              />
              <TokenSelect />
              <Button
                onClick={async () => {
                  send({ type: "CHANGE_AMOUNT", amount, contract: "0x0" })
                  send("SEND_APPROVE")
                  send("APPROVED")
                }}
              >
                {state.matches("approving")
                  ? "Approving..."
                  : state.matches("sending")
                  ? "Sending..."
                  : state.matches("send")
                  ? "Send"
                  : // "paired" and "approve" left
                    "Pre-authorize tokens"}
              </Button>
            </InputWrapper>
          )}
        </Box>
      </Center>
    </PageWrapper>
  )
}

import styled, { css, keyframes } from "styled-components"
import { theme } from "styled-tools"

import Address from "../../components/Address"
import Center from "../../components/Center"
import { centerMixin } from "../../mixins.style"

export const IconBar = styled(Center)`
  margin-top: -30px;
  z-index: 1;
  p {
    font-size: 14px;
  }
`

const WaitAndShowAnimation = keyframes`
  0% {
    opacity: 0;
  }
  90% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

export const OpenseaWrapper = styled.div`
  ${centerMixin}
  margin-top: 64px;
  flex-direction: row;
  animation: ${WaitAndShowAnimation} 5s ease-in-out;
`

export const SAddress = styled(Address)`
  margin-top: 16px;
`

export const DisplayModeWrapper = styled.div`
  margin: 64px 0 32px;

  display: flex;
  align-items: center;
  width: calc(100% - 35vw);
  text-align: left;
  gap: 1em;
  > span {
    color: #8f8e8c;
  }
`

export const DisplayModeButton = styled.div<{ active?: boolean }>`
  color: ${({ theme }) => theme.colors.fc};
  font-weight: 400;
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
  transition: all 200ms ease-in-out;

  ${({ active = false }) =>
    active
      ? css`
          font-weight: 600;
          background-color: ${theme("colors.btnBg")};
        `
      : ""}
`

import { BigNumber } from "ethers"
import { FC, useState } from "react"
import { Helmet } from "react-helmet"
import usePromise from "react-promise-suspense"
import TimeAgo from "react-timeago"
import { withTheme } from "styled-components"

import ArgentLogo from "../../components/ArgentLogo"
import Avatar from "../../components/Avatar"
import Center from "../../components/Center"
import DarkmodeSwitch from "../../components/DarkmodeSwitch"
import IconButton from "../../components/IconButton"
import PageWrapper from "../../components/PageWrapper"
import Box from "../../components/ProfileBox"
import Add from "../../components/Svgs/Add"
import Feed from "../../components/Svgs/Feed"
import Gallery from "../../components/Svgs/Gallery"
import { getERC20BalancesAndAllowances } from "../../libs/erc20"
import { Proposal } from "../../libs/snapshot"
import { getProposalsByState, tokenAddressBySpace } from "../../libs/snapshot"
import { readProvider } from "../../libs/web3"
import { useRouterMachine } from "../../states/hooks"
import { Theme } from "../../themes/theme"
import {
  DisplayModeButton,
  DisplayModeWrapper,
  IconBar,
  SAddress,
} from "../Gallery/Gallery.style"

const fetchRelevantProposals = async (
  address: string,
  state: "active" | "closed",
): Promise<Proposal[]> => {
  const balances = await getERC20BalancesAndAllowances(
    readProvider,
    address,
    Object.values(tokenAddressBySpace),
    "0xe79057088a15ac8c9c8bec3b90bd9891a1b3af51",
  )
  const relevantSpaces = Object.keys(tokenAddressBySpace)
    .map((x, i) => [x, balances[i].balance] as [string, BigNumber])
    .filter(([, balance]) => balance.gt(0))
    .map(([space]) => space)

  if (relevantSpaces.length === 0) {
    return []
  }

  const relevantProposals = await getProposalsByState(
    state,
    relevantSpaces as any,
  )

  return relevantProposals
}

export const FeedPage = withTheme(({ theme }: { theme: Theme }) => {
  const [
    {
      context: { name, walletAddress, hasZkSync },
    },
    send,
  ] = useRouterMachine()

  const [viewMode, setViewMode] = useState<"active" | "closed">("active")
  const proposals: Proposal[] = usePromise(fetchRelevantProposals, [
    walletAddress,
    viewMode,
  ])

  return (
    <PageWrapper>
      <DarkmodeSwitch />
      <Helmet>
        <title>Gallery - {name}</title>
      </Helmet>
      <ArgentLogo />
      <Center>
        <Avatar
          pubkey={walletAddress}
          size="80px"
          sizemobile="80px"
          bw="10px"
        />
        <Box
          onBackButtonClick={() => send("PUSH_HOME")}
          lean
          pt="64px"
          title={`@${name}`}
        >
          <SAddress
            confirmationText="Copied!"
            address={walletAddress}
            short
            zkSync={hasZkSync}
          />
        </Box>
        <IconBar direction="row" gap="40px">
          <IconButton
            Icon={<Add />}
            text={hasZkSync ? "Add funds" : "Add funds to Vault"}
            size={48}
            maxTextWidth={80}
            mobileSize={48}
            svgSize={24}
            mobileSvgSize={24}
            aria-label={hasZkSync ? "Add funds" : "Add funds to Vault"}
            onClick={() => send("PUSH_SEND")}
          />
          <IconButton
            Icon={<Gallery />}
            text="NFT Gallery"
            size={48}
            maxTextWidth={80}
            mobileSize={48}
            svgSize={24}
            mobileSvgSize={24}
            aria-label="NFT Gallery"
            bgColor="#FFBF3D"
            onClick={() => send("PUSH_GALLERY")}
          />
          <IconButton
            Icon={<Feed />}
            text="Feed"
            size={48}
            maxTextWidth={80}
            mobileSize={48}
            svgSize={24}
            mobileSvgSize={24}
            aria-label="Feed"
            bgColor="#5CD3FF"
            onClick={() => send("PUSH_FEED")}
          />
        </IconBar>
      </Center>
      {proposals.length ? (
        <DisplayModeWrapper>
          <span>View by</span>
          <DisplayModeButton
            active={viewMode === "active"}
            onClick={() => setViewMode("active")}
          >
            New
          </DisplayModeButton>
          <DisplayModeButton
            active={viewMode === "closed"}
            onClick={() => setViewMode("closed")}
          >
            History
          </DisplayModeButton>
        </DisplayModeWrapper>
      ) : (
        <p style={{ marginTop: 32 }}>
          You dont own any gov tokens we support :(
        </p>
      )}
      {/* flex vertical */}
      <div
        style={{
          width: "min(calc(100vw - 128px), 690px)",
          backgroundColor: "#EDEDED",
          boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.04)",
          borderRadius: 8,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: "1px",
        }}
      >
        {proposals.map((proposal) => (
          <ProposalView key={proposal.id} proposal={proposal} />
        ))}
      </div>
    </PageWrapper>
  )
})

const resolveIpfsLink = (link: string) =>
  link.replace("ipfs://", "https://ipfs.io/ipfs/")

// render given proposal
const ProposalView: FC<{ proposal: Proposal }> = ({ proposal }) => {
  return (
    <div
      style={{
        padding: 32,
        display: "flex",
        backgroundColor: "white",
      }}
    >
      <img
        src={resolveIpfsLink(proposal.space.avatar)}
        alt={proposal.space.id}
        style={{
          width: "56px",
          height: "56px",
        }}
      />
      <div
        style={{
          marginLeft: 32,
          flex: "auto",
        }}
      >
        <p
          style={{
            lineHeight: "18px",
            fontSize: "14px",
            fontWeight: 600,
            color: "#0078A4",
          }}
        >
          {proposal.space.name}
          <span
            style={{
              fontSize: "12px",
              color: "#8F8E8C",
            }}
          >
            {" "}
            ∙ Governance Voting
          </span>
        </p>
        <h3
          style={{
            color: "#333332",
            fontSize: "20px",
            lineHeight: "25px",
            fontWeight: 700,

            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,

            WebkitBoxOrient: "vertical",
          }}
        >
          {proposal.title}
          <span
            style={{
              padding: "2px 8px",
              fontWeight: 600,
              fontSize: "13px",
              background: "rgba(2, 187, 168, 0.15)",
              borderRadius: "8px",
              color: "#02A697",
              marginLeft: "8px",
            }}
          >
            {`${proposal.state[0].toUpperCase()}${proposal.state.slice(1)}`}
          </span>
        </h3>
        <p
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            minHeight: "2em",
            marginTop: "8px",
            overflowWrap: "anywhere",
            WebkitBoxOrient: "vertical",
          }}
        >
          {proposal.body}
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <TimeAgo
            style={{
              fontWeight: 400,
              fontSize: "13px",
              lineHeight: "18px",
              color: "#8F8E8C",
            }}
            date={proposal.end * 1000}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <span
              style={{
                fontWeight: 400,
                fontSize: "13px",
                lineHeight: "18px",
                color: "#F36A3D",
                marginRight: 16,
              }}
            >
              Votes: {proposal.votes}
            </span>
            <a
              style={{
                fontWeight: 600,
                fontSize: "15px",
                lineHeight: "20px",
                color: "white",
                backgroundColor: "#FF875B",
                padding: "8px 24px",
                borderRadius: "24px",
              }}
              href={proposal.link}
            >
              View
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

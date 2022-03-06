export type OverviewType = {
  title: string;
  id: number;
  proposer: string;
  description: string;
  status: string;
  submitTime: string;
  depositEndTime: string;
  votingStartTime: string | null;
  votingEndTime: string | null;
  content: string;
}

// export type TallyType = {
//   yes: number;
//   no: number;
//   abstain: number;
//   veto: number;
//   total: number;
//   quorum: number;
//   bondedTokens: number;
//   denom: string;
// }

// export type VoteType = {
//   vote: string;
//   user: string;
// }

// export type DepositType = {
// amount: TokenUnit;
// user: string;
// }

// export type ValidatorType = {
//   selfDelegateAddress: string;
//   operatorAddress: string;
// }

export type ProposalState = {
  loading: boolean;
  exists: boolean;
  // content: string;
  overview: OverviewType;
  // tally: TallyType;
  // votes: {
  //   tab: number;
  //   yes: number;
  //   no: number;
  //   abstain: number;
  //   veto: number;
  //   total: number;
  //   notVoted: number;
  //   data: VoteType[];
  //   notVotedData: VoteType[];
  // };
  // deposits: DepositType[];
}

import { useState } from 'react';
import * as R from 'ramda';
import numeral from 'numeral';
import { useRouter } from 'next/router';
import {
  useProposalDetailsQuery,
  ProposalDetailsQuery,
  useProposalVotesListenerSubscription,
  ProposalVotesListenerSubscription,
  useProposalTallyListenerSubscription,
  ProposalTallyListenerSubscription,
  useTallyParamsQuery,
  TallyParamsQuery,
} from '@graphql/types';
import { getDenom } from '@utils/get_denom';
import { formatDenom } from '@utils/format_denom';
import { useChainContext } from '@contexts';
import { ProposalState } from './types';

export const useProposalDetails = () => {
  const router = useRouter();
  const { findAddress } = useChainContext();
  const [state, setState] = useState<ProposalState>({
    loading: true,
    exists: true,
    content: '',
    overview: {
      title: '',
      id: 0,
      description: '',
      status: '',
      submitTime: '',
      depositEndTime: '',
      votingStartTime: '',
      votingEndTime: '',
    },
    tally: {
      yes: 0,
      no: 0,
      abstain: 0,
      veto: 0,
      total: 0,
      quorum: 0,
      bondedTokens: 0,
    },
    votes: [],
    deposits: [],
  });

  const handleSetState = (stateChange: any) => {
    setState((prevState) => R.mergeDeepLeft(stateChange, prevState));
  };

  // ==========================
  // fetch data
  // ==========================
  useProposalDetailsQuery({
    variables: {
      proposalId: R.pathOr('', ['query', 'id'], router),
    },
    onCompleted: (data) => {
      handleSetState(formatProposalQuery(data));
    },
  });

  useProposalVotesListenerSubscription({
    variables: {
      proposalId: R.pathOr('', ['query', 'id'], router),
    },
    onSubscriptionData: (data) => {
      handleSetState({
        votes: formatProposalVotes(data.subscriptionData.data),
      });
    },
  });

  useProposalTallyListenerSubscription({
    variables: {
      proposalId: R.pathOr('', ['query', 'id'], router),
    },
    onSubscriptionData: (data) => {
      handleSetState({
        tally: formatProposalTally(data.subscriptionData.data),
      });
    },
  });

  useTallyParamsQuery({
    onCompleted: (data) => {
      handleSetState({
        tally: formatTallyParams(data),
      });
    },
  });

  // ==========================
  // parsers
  // ==========================

  const formatProposalQuery = (data: ProposalDetailsQuery) => {
    const stateChange: any = {
      rawData: {
        loading: false,
      },
    };

    if (!data.proposal.length) {
      stateChange.exists = false;
      return stateChange;
    }

    // =========================
    // content
    // =========================
    stateChange.content = data.proposal[0].content;

    // =========================
    // overview
    // =========================
    const formatOverview = () => {
      const overview = {
        title: data.proposal[0].title,
        id: data.proposal[0].proposalId,
        description: data.proposal[0].description,
        status: data.proposal[0].status,
        submitTime: data.proposal[0].submitTime,
        depositEndTime: data.proposal[0].depositEndTime,
        votingStartTime: data.proposal[0].votingStartTime !== '0001-01-01T00:00:00' ? data.proposal[0].votingStartTime : null,
        votingEndTime: data.proposal[0].votingEndTime !== '0001-01-01T00:00:00' ? data.proposal[0].votingEndTime : null,
      };

      return overview;
    };

    stateChange.overview = formatOverview();

    // =========================
    // deposits
    // =========================
    const formatDeposits = () => {
      const deposits = data.proposal[0].proposalDeposits.map((x) => {
        const depositAmount = getDenom(x.amount);
        const user = findAddress(x.depositorAddress);
        return ({
          user: {
            address: x.depositorAddress,
            imageUrl: user.imageUrl,
            name: user.moniker,
          },
          amount: formatDenom(depositAmount.amount),
        });
      });
      return deposits;
    };

    stateChange.deposits = formatDeposits();

    return stateChange;
  };

  const formatProposalVotes = (data: ProposalVotesListenerSubscription) => {
    const votes = data.proposalVote.map((x) => {
      const user = findAddress(x.voterAddress);
      return ({
        user: {
          address: x.voterAddress,
          imageUrl: user.imageUrl,
          name: user.moniker,
        },
        vote: x.option,
      });
    });

    return votes;
  };

  const formatProposalTally = (data: ProposalTallyListenerSubscription) => {
    if (!data) {
      return state.tally;
    }
    const yes = formatDenom(R.pathOr(0, ['proposalTallyResult', 0, 'yes'], data));
    const no = formatDenom(R.pathOr(0, ['proposalTallyResult', 0, 'no'], data));
    const veto = formatDenom(R.pathOr(0, ['proposalTallyResult', 0, 'noWithVeto'], data));
    const abstain = formatDenom(R.pathOr(0, ['proposalTallyResult', 0, 'abstain'], data));

    return ({
      yes,
      no,
      abstain,
      veto,
      total: yes + no + abstain + veto,
    });
  };

  const formatTallyParams = (data: TallyParamsQuery) => {
    const percent = numeral(numeral(R.pathOr(state.tally.quorum, ['govParams', 0, 'tallyParams', 'quorum'], data)).format('0.[00]')).value();
    return ({
      quorum: percent,
      bondedTokens: formatDenom(R.pathOr(0, ['stakingPool', 0, 'bondedTokens'], data)),
    });
  };

  return {
    state,
  };
};

import { useState } from 'react';
import * as R from 'ramda';
import numeral from 'numeral';
import { useRouter } from 'next/router';
import dayjs from '@utils/dayjs';
import {
  useProposalDetailsQuery,
  ProposalDetailsQuery,
  useProposalVotesListenerSubscription,
  ProposalVotesListenerSubscription,
} from '@graphql/types';
import {
  AvatarName,
  Tag,
} from '@components';

import { getDenom } from '@utils/get_denom';
import { formatDenom } from '@utils/format_denom';
import { chainConfig } from '@src/chain_config';
import { useChainContext } from '@contexts';
import { ProposalState } from './types';

export const useProposal = (initialState: ProposalState) => {
  const router = useRouter();
  const [state, setState] = useState(initialState);
  const {
    findAddress,
  } = useChainContext();

  const handleSetState = (stateChange: any) => {
    setState((prevState) => R.mergeDeepLeft(stateChange, prevState));
  };

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
        rawData: {
          ...formatProposalVotes(data.subscriptionData.data),
        },
      });
    },
  });

  const formatProposalVotes = (data: ProposalVotesListenerSubscription) => {
    let yes = 0;
    let no = 0;
    let abstain = 0;
    let veto = 0;

    const votes = data.proposalVote.map((x) => {
      if (x.option === 'VOTE_OPTION_YES') {
        yes += 1;
      }
      if (x.option === 'VOTE_OPTION_ABSTAIN') {
        abstain += 1;
      }
      if (x.option === 'VOTE_OPTION_NO') {
        no += 1;
      }
      if (x.option === 'VOTE_OPTION_NO_WITH_VETO') {
        veto += 1;
      }
      return ({
        voter: x.voterAddress,
        vote: x.option,
      });
    });

    return {
      votes,
      voteTally: {
        yes,
        no,
        abstain,
        veto,
      },
    };
  };

  const formatProposalQuery = (data: ProposalDetailsQuery) => {
    const results: any = {
      rawData: {
        loading: false,
      },
    };

    if (!data.proposal.length) {
      results.rawData.exists = false;
      return results;
    }

    // =========================
    // overview
    // =========================
    const overview = {
      title: data.proposal[0].title,
      id: data.proposal[0].proposalId,
      description: data.proposal[0].description,
      status: data.proposal[0].status,
      submitTime: data.proposal[0].submitTime,
      depositEndTime: data.proposal[0].depositEndTime,
      votingStartTime: data.proposal[0].votingStartTime !== '0001-01-01T00:00:00' ? data.proposal[0].votingStartTime : null,
      votingEndTime: data.proposal[0].votingEndTime !== '0001-01-01T00:00:00' ? data.proposal[0].votingEndTime : null,
      content: data.proposal[0].content,
    };

    results.rawData.overview = overview;

    // =========================
    // deposits
    // =========================
    const deposits = data.proposal[0].proposalDeposits.map((x) => {
      const depositAmount = getDenom(x.amount);
      return ({
        depositor: x.depositorAddress,
        amount: formatDenom(depositAmount.amount),
      });
    });

    results.rawData.deposits = deposits;

    return results;
  };

  const getProposalType = (proposalType: string) => {
    let type = proposalType;
    if (proposalType === '/cosmos.gov.v1beta1.TextProposal') {
      type = 'textProposal';
    }

    if (proposalType === '/cosmos.params.v1beta1.ParameterChangeProposal') {
      type = 'parameterChangeProposal';
    }

    if (proposalType === '/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal') {
      type = 'softwareUpgradeProposal';
    }

    return type;
  };

  const formatUi = () => {
    // =========================
    // overview
    // =========================
    const overview: any = {
      title: state.rawData.overview.title,
      id: `#${numeral(state.rawData.overview.id).format('0,0')}`,
      description: state.rawData.overview.description,
      status: (
        <Tag theme="one" value={state.rawData.overview.status.replace('PROPOSAL_STATUS_', '').replace('_', ' ')} />
      ),
      submitTime: dayjs.utc(state.rawData.overview.submitTime).local().format('MMMM DD, YYYY hh:mm A'),
      depositEndTime: dayjs.utc(state.rawData.overview.depositEndTime).local().format('MMMM DD, YYYY hh:mm A'),
      type: getProposalType(R.pathOr('', [
        'rawData', 'overview', 'content', '@type',
      ], state)),
    };

    if (state.rawData.overview.votingStartTime) {
      overview.votingStartTime = dayjs.utc(state.rawData.overview.votingStartTime).local().format('MMMM DD, YYYY hh:mm A');
    }

    if (state.rawData.overview.votingEndTime) {
      overview.votingEndTime = dayjs.utc(state.rawData.overview.votingEndTime).local().format('MMMM DD, YYYY hh:mm A');
    }

    // =========================
    // deposits
    // =========================
    const deposits = state.rawData.deposits.map((x) => {
      const depositor = findAddress(x.depositor);

      return ({
        depositor: (
          <AvatarName
            address={x.depositor}
            imageUrl={depositor ? depositor?.imageUrl : null}
            name={depositor ? depositor.moniker : x.depositor}
          />
        ),
        amount: `${numeral(x.amount).format('0,0.[000000]')} ${chainConfig.display.toUpperCase()}`,
      });
    });

    // =========================
    // votes
    // =========================

    const votes = state.rawData.votes.filter((x) => {
      if (state.tab === 1) {
        return x.vote === 'VOTE_OPTION_YES';
      }

      if (state.tab === 2) {
        return x.vote === 'VOTE_OPTION_NO';
      }

      if (state.tab === 3) {
        return x.vote === 'VOTE_OPTION_NO_WITH_VETO';
      }

      if (state.tab === 4) {
        return x.vote === 'VOTE_OPTION_ABSTAIN';
      }

      return true;
    }).map((x) => {
      const voter = findAddress(x.voter);
      return ({
        voter: (
          <AvatarName
            address={x.voter}
            imageUrl={voter ? voter?.imageUrl : null}
            name={voter ? voter.moniker : x.voter}
          />
        ),
        vote: x.vote,
      });
    });

    return ({
      overview,
      deposits,
      votes,
    });
  };

  const handleTabChange = (_event: any, newValue: number) => {
    setState((prevState) => ({
      ...prevState,
      tab: newValue,
    }));
  };

  return {
    rawData: state.rawData,
    uiData: formatUi(),
    handleTabChange,
    tab: state.tab,
  };
};

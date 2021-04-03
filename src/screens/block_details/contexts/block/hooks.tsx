import {
  useState,
  useEffect,
} from 'react';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import dayjs from '@utils/dayjs';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import numeral from 'numeral';
import { Typography } from '@material-ui/core';
import {
  BLOCK_DETAILS, TRANSACTION_DETAILS,
} from '@utils/go_to_page';
import { replaceNaN } from '@utils/replace_nan';
import {
  AvatarName, Result,
} from '@components';
import { useChainContext } from '@contexts';
import { formatDenom } from '@utils/format_denom';
import { getMiddleEllipsis } from '@utils/get_middle_ellipsis';
import {
  useBlockDetailsQuery,
  BlockDetailsQuery,
} from '@graphql/types';
import { BlockState } from './types';

export const useBlock = (initialState: BlockState) => {
  const router = useRouter();
  const { t } = useTranslation('blocks');
  const { findAddress } = useChainContext();

  const [state, setState] = useState(initialState);

  const handleSetState = (stateChange: typeof state) => {
    setState((prevState) => R.mergeDeepLeft(stateChange, prevState));
  };

  useBlockDetailsQuery({
    variables: {
      height: numeral(router.query.height).value(),
    },
    onCompleted: (data) => {
      handleSetState(formatBlockDetails(data));
    },
  });

  const formatBlockDetails = (data: BlockDetailsQuery) => {
    const results: any = {
      rawData: {
        loading: false,
      },
    };

    if (!data.block.length) {
      results.rawData.exists = false;
      return results;
    }

    const block = {
      height: data.block[0].height,
      hash: data.block[0].hash,
      txs: data.block[0].txs,
      timestamp: data.block[0].timestamp,
      proposer: data.block[0].validator.validatorInfo.operatorAddress,
      votingPower: R.pathOr(0, [
        'block',
        0,
        'preCommitsAggregate',
        'aggregate',
        'sum',
        'votingPower',
      ], data),
    };

    results.rawData.block = block;

    const supply = {
      bonded: formatDenom(R.pathOr(0, ['pool', 0, 'bondedTokens'], data)),
    };
    results.rawData.supply = supply;

    const transactions = data.transaction.map((x) => {
      return ({
        height: x.height,
        hash: x.hash,
        success: x.success,
        timestamp: results.rawData.block.timestamp,
        messages: x.messages.length,
      });
    });

    results.rawData.transactions = transactions;

    const signedDictionary = {};
    data.preCommits.forEach((x) => {
      signedDictionary[x.validator.validatorInfo.operatorAddress] = true;
    });

    const signatures = data.validatorStatus.map((x) => {
      const validator = x.validator.validatorInfo.operatorAddress;
      return ({
        validator,
        votingPower: R.pathOr(0, [
          'validator',
          'validatorVotingPowers',
          0,
          'votingPower',
        ], x),
        signed: !!signedDictionary[validator],
      });
    });

    results.rawData.signatures = signatures;

    return results;
  };

  const formatUi = (screen: 'mobile' | 'desktop' = 'mobile') => {
    const proposer = findAddress(state.rawData.block.proposer);
    return ({
      // ============================
      // blocks
      // ============================
      block: [
        {
          label: t('height'),
          detail: (
            <Link href={BLOCK_DETAILS(state.rawData.block.height)} passHref>
              <Typography variant="body1" className="value" component="a">
                {numeral(state.rawData.block.height).format('0,0')}
              </Typography>
            </Link>
          ),
        },
        {
          label: t('hash'),
          detail: state.rawData.block.hash,
        },
        {
          label: t('proposer'),
          detail: (
            <AvatarName
              address={state.rawData.block.proposer}
              imageUrl={proposer ? proposer?.imageUrl : null}
              name={proposer ? proposer.moniker : state.rawData.block.proposer}
            />
          ),
        },
        {
          label: t('time'),
          detail: replaceNaN(dayjs.utc(state.rawData.block.timestamp).fromNow()),
        },
        {
          label: t('signedVotingPower'),
          detail: `${replaceNaN(
            numeral((state.rawData.block.votingPower / state.rawData.supply.bonded) * 100).format('0.00'),
          )}%`,
        },
        {
          label: t('txs'),
          detail: numeral(state.rawData.block.txs).format('0,0'),
        },
      ],
      // ============================
      // transactions
      // ============================
      transactions: state.rawData.transactions.map((x) => {
        const hash = screen === 'mobile'
          ? getMiddleEllipsis(x.hash, {
            beginning: 15, ending: 5,
          }) : getMiddleEllipsis(x.hash, {
            beginning: 15, ending: 5,
          });
        return ({
          block: (
            <Link href={BLOCK_DETAILS(x.height)} passHref>
              <Typography variant="body1" component="a">
                {numeral(x.height).format('0,0')}
              </Typography>
            </Link>
          ),
          hash: (
            <Link href={TRANSACTION_DETAILS(x.hash)} passHref>
              <Typography variant="body1" component="a">
                {hash}
              </Typography>
            </Link>
          ),
          result: (
            <Result success={x.success} />
          ),
          time: replaceNaN(dayjs.utc(x.timestamp).fromNow()),
          messages: numeral(x.messages).format('0,0'),
        });
      }),
      // ============================
      // signatures
      // ============================
      signatures: state.rawData.signatures.map((x) => {
        const signatureValidator = findAddress(x.validator);
        return ({
          signed: (
            <Result success={x.signed} />
          ),
          validator: (
            <AvatarName
              address={x.validator}
              imageUrl={signatureValidator ? signatureValidator?.imageUrl : null}
              name={signatureValidator ? signatureValidator.moniker : x.validator}
            />
          ),
          votingPower: `${replaceNaN(
            numeral((x.votingPower / state.rawData.supply.bonded) * 100).format('0.00'),
          )}%`,
        });
      }),
    });
  };

  return {
    uiData: formatUi(),
    rawData: state.rawData,
  };
};

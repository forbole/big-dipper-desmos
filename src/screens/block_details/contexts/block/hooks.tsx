import {
  useState,
  useEffect,
} from 'react';
import * as R from 'ramda';
import dayjs from '@utils/dayjs';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import numeral from 'numeral';
import { Typography } from '@material-ui/core';
import { BLOCK_DETAILS } from '@utils/go_to_page';
import { AvatarName } from '@components';
import { useChainContext } from '@contexts';
import {
  useBlockDetailsQuery,
  BlockDetailsQuery,
} from '@graphql/types';

export const useBlock = () => {
  const fakeSignature = {
    validator: {
      image: 'https://s3.amazonaws.com/keybase_processed_uploads/f5b0771af36b2e3d6a196a29751e1f05_360_360.jpeg',
      moniker: 'Forbole',
      identity: 'FKsC411dik9ktS6xPADxs4Fk2SCENvAiuccQHLAPndvk',
    },
    votingPower: '10%',
    signed: true,
  };

  const fakeSignatureTwo = {
    validator: {
      image: 'https://s3.amazonaws.com/keybase_processed_uploads/f5b0771af36b2e3d6a196a29751e1f05_360_360.jpeg',
      moniker: 'Forbole',
      identity: 'FKsC411dik9ktS6xPADxs4Fk2SCENvAiuccQHLAPndvk',
    },
    votingPower: '50%',
    signed: false,
  };

  const fakeTransactions = {
    block: '812,768,640',
    hash: '76nwV8zz8tLz97SBRXH6uwHvgHXtqJDLQfF66jZhQ857',
    messages: 123,
    success: false,
    time: 1615187146246,
  };

  const fakeTransactionsTwo = {
    block: '812,768,640',
    hash: '76nwV8zz8tLz97SBRXH6uwHvgHXtqJDLQfF66jZhQ857',
    messages: 12,
    success: true,
    time: 1615187146246,
  };

  const fakeData = {
    height: '812,768,640',
    proposer: {
      image: 'https://s3.amazonaws.com/keybase_processed_uploads/f5b0771af36b2e3d6a196a29751e1f05_360_360.jpeg',
      moniker: 'Forbole',
      identity: 'FKsC411dik9ktS6xPADxs4Fk2SCENvAiuccQHLAPndvk',
    },
    hash: '76nwV8zz8tLz97SBRXH6uwHvgHXtqJDLQfF66jZhQ857',
    txs: 2,
    time: 1615187146246,
    signedVotingPower: '89%',
    signatures: [...Array(4).fill(fakeSignature), ...Array(4).fill(fakeSignatureTwo)],
    transactions: [...Array(4).fill(fakeTransactions), ...Array(4).fill(fakeTransactionsTwo)],
  };

  const [fakestate, fsetState] = useState<any>({
    item: {},
  });

  useEffect(() => {
    fsetState((prevState) => ({
      ...prevState,
      item: fakeData,
    }));
  }, []);

  const {
    item,
  } = fakestate;

  // ==============================
  // start
  // ==============================
  const { t } = useTranslation('blocks');
  const { findAddress } = useChainContext();
  const initialState: {
    exists: false;
    loading: true;
    block: {
      height: number;
      txs: number;
      timestamp: string;
      proposer: string;
      hash: string;
    }
  } = {
    block: {
      height: 0,
      hash: '',
      txs: 0,
      timestamp: '',
      proposer: '',
    },
  };

  const [state, setState] = useState(initialState);

  const handleSetState = (stateChange: typeof state) => {
    setState((prevState) => R.mergeDeepLeft(stateChange, prevState));
  };

  useBlockDetailsQuery({
    onCompleted: (data) => {
      handleSetState(formatBlockDetails(data));
    },
  });

  const formatBlockDetails = (data: BlockDetailsQuery) => {
    const results: any = {
      loading: false,
    };

    if (!data.block.length) {
      results.exists = false;
      return results;
    }

    const block = {
      height: data.block[0].height,
      hash: data.block[0].hash,
      txs: data.block[0].txs,
      timestamp: data.block[0].timestamp,
      proposer: data.block[0].validator.validatorInfo.operatorAddress,
    };

    results.block = block;
  };

  const formatUi = () => {
    const validator = findAddress(state.block.proposer);
    return ({
      block: [
        {
          label: t('height'),
          detail: (
            <Link href={BLOCK_DETAILS(state.block.height)} passHref>
              <Typography variant="body1" className="value" component="a">
                {numeral(state.block.height).format('0,0')}
              </Typography>
            </Link>
          ),
        },
        {
          label: t('hash'),
          detail: state.block.hash,
        },
        {
          label: t('proposer'),
          detail: (
            <AvatarName
              address={state.block.proposer}
              imageUrl={validator ? validator?.imageUrl : null}
              name={validator ? validator.moniker : state.block.proposer}
            />
          ),
        },
        {
          label: t('time'),
          detail: dayjs.utc(state.block.timestamp).fromNow(),
        },
        {
          label: t('signedVotingPower'),
          detail: '100%',
        },
        {
          label: t('txs'),
          detail: numeral(state.block.txs).format('0,0'),
        },
      ],
    });
  };

  return {
    item,
    uiData: formatUi(),
    rawData: state,
  };
};

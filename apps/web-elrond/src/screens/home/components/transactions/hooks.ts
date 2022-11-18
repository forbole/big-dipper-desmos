import { useCallback, useState } from 'react';
import * as R from 'ramda';
import axios from 'axios';
import { POLLING_INTERVAL, TRANSACTIONS } from '@api';
import { useInterval } from 'ui/hooks';
import type { TransactionState } from './types';

export const PAGE_SIZE = 7;

export const useBlocks = () => {
  const [state, setState] = useState<TransactionState>({
    items: [],
  });

  const getTransactionsByPage = useCallback(async () => {
    const handleSetState = (stateChange: any) => {
      setState((prevState) => R.mergeDeepLeft(stateChange, prevState));
    };

    try {
      const { data: transactionsData } = await axios.get(TRANSACTIONS, {
        params: {
          from: 0,
          size: PAGE_SIZE,
        },
      });

      const items = transactionsData.map((x: any) => {
        return {
          hash: x.txHash,
          from: x.sender,
          to: x.receiver,
          timestamp: x.timestamp,
          status: x.status,
        };
      });

      handleSetState({
        items,
      });
    } catch (error) {
      console.log((error as any).message);
    }
  }, []);

  useInterval(getTransactionsByPage, POLLING_INTERVAL);

  return {
    state,
  };
};

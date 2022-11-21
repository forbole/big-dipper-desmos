import { useCallback, useState } from 'react';
import * as R from 'ramda';
import {
  useBlocksListenerSubscription,
  BlocksListenerSubscription,
} from '@graphql/types/general_types';
import type { BlocksState } from './types';

export const useBlocks = () => {
  const [state, setState] = useState<BlocksState>({
    items: [],
  });

  const handleSetState = useCallback((stateChange: any) => {
    setState((prevState) => R.mergeDeepLeft(stateChange, prevState));
  }, []);

  // ================================
  // block subscription
  // ================================
  useBlocksListenerSubscription({
    onData: (data) => {
      handleSetState({
        items: data.data.data ? formatBlocks(data.data.data) : [],
      });
    },
  });

  const formatBlocks = (data: BlocksListenerSubscription) =>
    data.blocks.map((x) => {
      const proposerAddress = R.pathOr('', ['validator', 'validatorInfo', 'operatorAddress'], x);
      return {
        height: x.height,
        txs: x.txs ?? 0,
        hash: x.hash,
        timestamp: x.timestamp,
        proposer: proposerAddress,
      };
    }) ?? [];

  return {
    state,
  };
};

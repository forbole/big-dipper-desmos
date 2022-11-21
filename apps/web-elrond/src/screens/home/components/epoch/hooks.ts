import { useCallback, useEffect, useState } from 'react';
import * as R from 'ramda';
import axios from 'axios';
import { STATS } from '@api';
import type { EpochState } from './types';

export const useEpoch = () => {
  const [state, setState] = useState<EpochState>({
    epoch: 0,
    roundsPassed: 0,
    roundsPerEpoch: 0,
  });

  const handleSetState = useCallback((stateChange: any) => {
    setState((prevState) => R.mergeDeepLeft(stateChange, prevState));
  }, []);

  useEffect(() => {
    const getEpoch = async () => {
      try {
        const { data: statsData } = await axios.get(STATS);

        handleSetState({
          epoch: statsData.epoch,
          roundsPassed: statsData.roundsPassed,
          roundsPerEpoch: statsData.roundsPerEpoch,
        });
      } catch (error: any) {
        console.error(error.message);
      }
    };

    getEpoch();
  }, [handleSetState]);

  return {
    state,
  };
};

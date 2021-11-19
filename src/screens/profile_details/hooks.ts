import {
  useState, useEffect,
} from 'react';
import * as R from 'ramda';
import { useRouter } from 'next/router';
import { chainConfig } from '@src/configs';
import { useDesmosProfile } from '@hooks';
import { ProfileDetailState } from './types';

const initialState: ProfileDetailState = {
  loading: true,
  exists: true,
  desmosProfile: null,
};

export const useProfileDetails = () => {
  const router = useRouter();
  const [state, setState] = useState<ProfileDetailState>(initialState);
  const handleSetState = (stateChange: any) => {
    setState((prevState) => R.mergeDeepLeft(stateChange, prevState));
  };

  // ==========================
  // Desmos Profile
  // ==========================
  const {
    fetchDesmosProfile, formatDesmosProfile,
  } = useDesmosProfile({
    onComplete: (data) => {
      handleSetState({
        desmosProfile: formatDesmosProfile(data),
      });
      handleSetState(formatProfileQuery(data));
    },
  });

  useEffect(() => {
    handleSetState(initialState);
    if (chainConfig.extra.profile) {
      fetchDesmosProfile(R.pathOr('', ['query', 'dtag'], router));
    }
  },
  [R.pathOr('', ['query', 'dtag'], router)]);

  // ==========================
  // Fetch Data
  // ==========================

  const formatProfileQuery = (data: ProfileDetailState) => {
    const stateChange: any = {
      loading: false,
    };
    console.log('account data', data);
    console.log('statechange.loading', stateChange.loading);

    if (!data.desmosProfile) {
      stateChange.exists = false;
      return stateChange;
    }
    return stateChange;
  };

  return {
    state,
  };
};

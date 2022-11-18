import { useState, useEffect, useCallback } from 'react';
import * as R from 'ramda';
import { useRouter } from 'next/router';
import chainConfig from 'ui/chainConfig';
import { useDesmosProfile } from 'ui/hooks';
import type { ProfileDetailState } from './types';

const initialState: ProfileDetailState = {
  loading: true,
  exists: true,
  desmosProfile: null,
};

export const useProfileDetails = () => {
  const router = useRouter();
  const [state, setState] = useState<ProfileDetailState>(initialState);

  const shouldShowProfile = useCallback(() => {
    const dtagConnections = state.desmosProfile?.connections ?? [];
    const dtagConnectionsNetwork = dtagConnections.map((x) => {
      return x.identifier;
    });
    const chainPrefix = chainConfig.prefix.account;
    const containNetwork = dtagConnectionsNetwork.some((x) => x.startsWith(chainPrefix));
    if (containNetwork) {
      return true;
    }
  }, [state.desmosProfile?.connections]);

  useEffect(() => {
    const handleSetState = (stateChange: any) => {
      setState((prevState) => R.mergeDeepLeft(stateChange, prevState));
    };

    // ==========================
    // Desmos Profile
    // ==========================
    const { fetchDesmosProfile, formatDesmosProfile } = useDesmosProfile({
      onComplete: (data) => {
        handleSetState({
          loading: false,
          exists: !!data.profile.length,
          desmosProfile: formatDesmosProfile(data),
        });
      },
    });

    const regex = /^@/;
    const profileDtag = router.query.dtag as string;
    const regexCheck = regex.test(profileDtag);
    const configProfile = chainConfig.extra.profile;
    handleSetState(initialState);

    if (!regexCheck || !configProfile) {
      router.replace('/');
    }

    if (configProfile) {
      fetchDesmosProfile(R.pathOr('', ['query', 'dtag'], router));
    }
  }, [router]);

  useEffect(() => {
    if (state.desmosProfile) {
      const showProfile = shouldShowProfile();

      if (showProfile) {
        const dtagInput = router.query.dtag as string;
        if (
          `@${state.desmosProfile.dtag}` !== dtagInput &&
          `@${state.desmosProfile.dtag.toUpperCase()}` === dtagInput.toUpperCase()
        ) {
          router.push(
            { pathname: `/@${state.desmosProfile.dtag}` },
            `/@${state.desmosProfile.dtag}`,
            { shallow: true }
          );
        }
      } else {
        handleSetState({
          exists: false,
        });
      }
    }
  }, [router, shouldShowProfile, state.desmosProfile]);

  return {
    state,
    shouldShowProfile,
  };
};

import { ReadOnlySelectorOptions, selector } from 'recoil';
import { mergeStateChange } from 'ui/utils/merge_state_change';
import { atomState } from './atom';
import { AtomState } from './types';

const getMarket: ReadOnlySelectorOptions<AtomState>['get'] = ({ get }) => {
  const state = get(atomState);
  return state;
};

export const writeMarket = selector({
  key: 'market.write.market',
  get: getMarket,
  set: ({ get, set }, value) => {
    const prevState = get(atomState);
    const newState = mergeStateChange(prevState, value);
    set(atomState, newState);
  },
});

export const readMarket = selector({
  key: 'market.read.market',
  get: getMarket,
});
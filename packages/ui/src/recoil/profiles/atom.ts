import { atomFamily } from 'recoil';
import type { AtomState } from './types';

const initialState: AtomState = null;

export const atomFamilyState = atomFamily<AtomState, string>({
  key: 'profile',
  default: initialState,
});

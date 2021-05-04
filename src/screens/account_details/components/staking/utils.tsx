import {
  Delegations,
  Redelgations,
  Unbondings,
} from './components';

export const getTabs = () => {
  return ([
    {
      id: 0,
      key: 'delegations',
      component: Delegations,
    },
    {
      id: 1,
      key: 'redelegations',
      component: Redelgations,
    },
    {
      id: 2,
      key: 'unbondings',
      component: Unbondings,
    },
  ]);
};

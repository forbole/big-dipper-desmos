export type BaseCategories =
  | 'bank'
  | 'crisis'
  | 'distribution'
  | 'governance'
  | 'slashing'
  | 'staking'
  | 'profiles'
  | 'ibc'
  | 'ibc-transfer'
  | 'authz'
  | 'feegrant'
  | 'vesting'
  | 'others';
export type CustomCategories = 'nft' | 'auction' | 'fantoken'; // custom modules
export type Categories = BaseCategories | CustomCategories;
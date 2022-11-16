import * as R from 'ramda';
import type { Categories } from '../types';

class MsgCreateDistribution {
  public category: Categories;
  public type: string;
  public json: any;
  public distributor: string;
  public distributionType:
    | 'DISTRIBUTION_TYPE_UNSPECIFIED'
    | 'DISTRIBUTION_TYPE_AIRDROP'
    | 'DISTRIBUTION_TYPE_VALIDATOR_SUBSIDY'
    | 'DISTRIBUTION_TYPE_LIQUIDITY_MINING';

  constructor(payload: any) {
    this.category = 'dispensation';
    this.json = payload.json;
    this.type = payload.type;
    this.distributor = payload.distributor;
    this.distributionType = payload.distributionType;
  }

  static fromJson(json: any): MsgCreateDistribution {
    return {
      category: 'dispensation',
      json,
      type: json['@type'],
      distributor: json.distributor,
      distributionType: R.pathOr('DISTRIBUTION_TYPE_UNSPECIFIED', ['distribution_type'], json),
    };
  }
}

export default MsgCreateDistribution;

import * as R from 'ramda';
import type { Categories } from '@/models/msg/types';

class MsgBurn {
  public category: Categories;

  public type: string;

  public json: object;

  public sender: string;

  public amount: string;

  public subspace_id: string;

  constructor(payload: object) {
    this.category = 'posts';
    this.type = R.pathOr('', ['type'], payload);
    this.json = R.pathOr({}, ['json'], payload);
    this.sender = R.pathOr('', ['sender'], payload);
    this.amount = R.pathOr('', ['amount'], payload);
    this.subspace_id = R.pathOr('', ['subspace_id'], payload);
  }

  static fromJson(json: object) {
    return {
      category: 'posts',
      type: R.pathOr('', ['@type'], json),
      json,
      sender: R.pathOr('', ['sender'], json),
      amount: R.pathOr('', ['amount'], json),
      subspace_id: R.pathOr('', ['subspace_id'], json),
    };
  }
}

export default MsgBurn;

import * as R from 'ramda';
import type { Categories } from '@/models/msg/types';

class MsgCreateReport {
  public category: Categories;

  public type: string;

  public json: object;

  public reporter: string;

  constructor(payload: object) {
    this.category = 'reactions';
    this.type = R.pathOr('', ['type'], payload);
    this.json = R.pathOr({}, ['json'], payload);
    this.reporter = R.pathOr('', ['reporter'], payload);
  }

  static fromJson(json: object) {
    return {
      category: 'reactions',
      type: R.pathOr('', ['@type'], json),
      json,
      reporter: R.pathOr('', ['reporter'], json),
    };
  }
}

export default MsgCreateReport;

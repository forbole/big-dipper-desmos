/* eslint-disable camelcase */
import * as R from 'ramda';
import { Categories } from '../types';

class MsgNftBurn {
  public category: Categories;
  public type: string;
  public json: any;
  public sender: string;
  public class_id: string;
  public id: string;

  constructor(payload: any) {
    this.category = 'asset';
    this.type = R.pathOr('', ['type'], payload);
    this.json = R.pathOr({}, ['json'], payload);
    this.sender = R.pathOr('', ['value', 'sender'], payload);
    this.class_id = R.pathOr('', ['value', 'class_id'], payload);
    this.id = R.pathOr('', ['value', 'id'], payload);
  }

  static fromJson(json: any) {
    return new MsgNftBurn({
      category: 'asset',
      json,
      type: R.pathOr('', ['@type'], json),
      sender: R.pathOr('', ['sender'], json),
      class_id: R.pathOr('', ['class_id'], json),
      id: R.pathOr('', ['id'], json),
    });
  }
}

export default MsgNftBurn;

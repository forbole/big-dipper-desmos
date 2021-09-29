import * as R from 'ramda';

class InflationRateParams {
  public inflation: {
    denom: string;
    inflation: string;
  }[];

  constructor(payload: any) {
    this.inflation = payload.inflation;
  }

  static fromJson(data: any) {
    return new InflationRateParams({
      inflation: data.inflation.map((x) => {
        return ({
          denom: R.pathOr(0, ['denom'], x),
          inflation: R.pathOr(0, ['inflation'], x),
        });
      }),
    });
  }
}

export default InflationRateParams;

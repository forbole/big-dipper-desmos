import React from 'react';

export type BlockState = {
  item?: any;
  rawData: {
    exists: boolean;
    loading: boolean;
    block: {
      height: number;
      txs: number;
      timestamp: string;
      proposer: string;
      hash: string;
      votingPower: number;
    }
    supply: {
      bonded: number;
    }
    transactions: {
      height: number;
      hash: string;
      success: boolean;
      timestamp: string;
      messages: number;
    }[]
  }
  uiData: {
    block: {
      label: string;
      detail: string | React.ReactNode;
    }[],
    transactions: {
      block: React.ReactNode;
      hash: React.ReactNode;
      result: React.ReactNode;
      time: string;
      messages: string;
    }[]
  };
}

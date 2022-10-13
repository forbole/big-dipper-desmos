import { useState } from 'react';
import * as R from 'ramda';
import {
  useTransactionsListenerSubscription,
  TransactionsListenerSubscription,
} from '@graphql/types/general_types';
import { TransactionsState } from './types';

export const useTransactions = () => {
  const [state, setState] = useState<TransactionsState>({
    items: [],
  });

  // ================================
  // txs subscription
  // ================================
  useTransactionsListenerSubscription({
    onSubscriptionData: (data) => {
      setState({
        items: formatTransactions(data.subscriptionData.data),
      });
    },
  });

  const formatTransactions = (data: TransactionsListenerSubscription) => {
    return data.transactions.map((x) => {
      const msgType = x.messages.map((eachMsg) => {
        const eachMsgType = R.pathOr('none type', ['@type'], eachMsg);
        return eachMsgType;
      });

      return ({
        height: x.height,
        hash: x.hash,
        type: msgType,
        success: x.success,
        timestamp: x.block.timestamp,
        messages: x.messages.length,
      });
    });
  };

  return {
    state,
  };
};

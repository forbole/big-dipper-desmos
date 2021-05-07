import React from 'react';
import { useTransaction } from './hooks';
import { TransactionState } from './types';

const initialState: TransactionState = {
  rawData: {
    exists: true,
    loading: true,
    filterBy: 'none',
    transaction: {
      hash: '',
      height: 0,
      timestamp: '',
      fee: 0,
      gasUsed: 0,
      gasWanted: 0,
      success: false,
      memo: '',
      error: '',
    },
    messages: [],
  },
  uiData: {
    transaction: [],
    messages: [],
  },
};

const TransactionContext = React.createContext<TransactionState>(initialState);

const TransactionProvider: React.FC = (props: {
  children: (options: {
  exists: boolean;
  loading: boolean;
}) => React.ReactNode; }) => {
  const { children } = props;

  const {
    rawData,
    onMessageFilterCallback,
    uiData,
  } = useTransaction(initialState);

  return (
    <TransactionContext.Provider
      value={{
        rawData,
        onMessageFilterCallback,
        uiData,
      }}
    >
      {children({
        exists: rawData.exists,
        loading: rawData.loading,
      })}
    </TransactionContext.Provider>
  );
};

const useTransactionContext = () => React.useContext(TransactionContext);

export {
  useTransactionContext,
  TransactionProvider,
  TransactionContext,
};

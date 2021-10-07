import React from 'react';
import classnames from 'classnames';
import numeral from 'numeral';
import dayjs, { formatDayJs } from '@utils/dayjs';
import Link from 'next/link';
import {
  TRANSACTION_DETAILS,
  BLOCK_DETAILS,
} from '@utils/go_to_page';
import {
  Typography,
} from '@material-ui/core';
import useTranslation from 'next-translate/useTranslation';
import { VariableSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useSettingsContext } from '@contexts';
import { mergeRefs } from '@utils/merge_refs';
import {
  Loading,
  Result,
} from '@components';
import {
  useList,
  useListRow,
} from '@hooks';
import { getMiddleEllipsis } from '@utils/get_middle_ellipsis';
import { getMessageByType } from '@msg';
import { useStyles } from './styles';
import { TransactionsListDetailsState } from '../../types';
import { SingleTransaction } from './components';

const TransactionList: React.FC<TransactionsListDetailsState> = ({
  className,
  itemCount,
  loadMoreItems,
  isItemLoaded,
  transactions,
}) => {
  const { t } = useTranslation('transactions');
  const classes = useStyles();
  const {
    dateFormat,
  } = useSettingsContext();

  const {
    listRef,
    getRowHeight,
    setRowHeight,
  } = useList();

  const items = transactions.map((x) => ({
    block: (
      <Link href={BLOCK_DETAILS(x.height)} passHref>
        <Typography variant="body1" component="a">
          {numeral(x.height).format('0,0')}
        </Typography>
      </Link>
    ),
    hash: (
      <Link href={TRANSACTION_DETAILS(x.hash)} passHref>
        <Typography variant="body1" component="a">
          {getMiddleEllipsis(x.hash, {
            beginning: 15, ending: 5,
          })}
        </Typography>
      </Link>
    ),
    result: (
      <Result success={x.success} />
    ),
    time: formatDayJs(dayjs.utc(x.timestamp), dateFormat),
    messageCount: numeral(x.messages.items.length).format('0,0'),
    messages: x.messages.items.map((message) => {
      return getMessageByType(message, false, t);
    }),
  }));

  return (
    <div className={classnames(className, classes.root)}>
      <AutoSizer>
        {({
          height, width,
        }) => {
          return (
            <InfiniteLoader
              isItemLoaded={isItemLoaded}
              itemCount={itemCount}
              loadMoreItems={loadMoreItems}
            >
              {({
                onItemsRendered, ref,
              }) => (
                <List
                  className="List"
                  height={height}
                  itemCount={itemCount}
                  itemSize={getRowHeight}
                  onItemsRendered={onItemsRendered}
                  ref={mergeRefs(listRef, ref)}
                  width={width}
                >
                  {({
                    index, style,
                  }) => {
                    const { rowRef } = useListRow(index, setRowHeight);
                    if (!isItemLoaded(index)) {
                      return (
                        <div style={style}>
                          <div ref={rowRef}>
                            <Loading />
                          </div>
                        </div>
                      );
                    }
                    const item = items[index];
                    return (
                      <div style={style}>
                        <div ref={rowRef}>
                          <SingleTransaction {...item} />
                        </div>
                      </div>
                    );
                  }}
                </List>
              )}
            </InfiniteLoader>
          );
        }}
      </AutoSizer>
    </div>
  );
};

export default TransactionList;

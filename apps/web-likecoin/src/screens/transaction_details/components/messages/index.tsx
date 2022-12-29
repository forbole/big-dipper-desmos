import Box from '@/components/box';
import { getMessageByType } from '@/components/msg/utils';
import TransactionMessagesFilter from '@/components/transaction_messages_filter';
import { useList, useListRow } from '@/hooks';
import { useStyles } from '@/screens/transaction_details/components/messages/styles';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import classnames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import React, { ChangeEvent, FC, LegacyRef } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { ListChildComponentProps, VariableSizeList as List } from 'react-window';

type ListItemProps = Pick<ListChildComponentProps, 'index' | 'style'> & {
  setRowHeight: Parameters<typeof useListRow>[1];
  classes: ReturnType<typeof useStyles>;
  message: unknown;
  isLast: boolean;
  viewRaw: boolean;
};

const ListItem: FC<ListItemProps> = ({
  index,
  style,
  setRowHeight,
  classes,
  message,
  isLast,
  viewRaw,
}) => {
  const { t } = useTranslation('transactions');
  const { rowRef } = useListRow(index, setRowHeight);
  const formattedItem = getMessageByType(message, viewRaw, t);
  return (
    <div style={style}>
      <div ref={rowRef}>
        <div className={classes.item}>
          <div className={classes.tags}>{formattedItem.type}</div>
          <span className="msg">{formattedItem.message}</span>
        </div>
        {!isLast && <Divider />}
      </div>
    </div>
  );
};

type MessagesProps = {
  className?: string;
  messages: unknown[];
  viewRaw: boolean;
  toggleMessageDisplay: (event: ChangeEvent<HTMLInputElement>) => void;
  onMessageFilterCallback: (value: string) => void;
};

const Messages: FC<MessagesProps> = ({ className, ...props }) => {
  const { t } = useTranslation('transactions');
  const classes = useStyles();

  const { listRef, getRowHeight, setRowHeight } = useList();

  return (
    <Box className={classnames(className, classes.root)}>
      <div className={classes.header}>
        <div className={classes.mobileOptions}>
          <Typography variant="h2">{t('messages')}</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={props.viewRaw}
                onChange={props.toggleMessageDisplay}
                color="primary"
              />
            }
            label={t('raw')}
          />
        </div>
        <div className={classes.desktopOptions}>
          <FormControlLabel
            control={
              <Switch
                checked={props.viewRaw}
                onChange={props.toggleMessageDisplay}
                color="primary"
              />
            }
            label={t('raw')}
          />
          <TransactionMessagesFilter
            className={classes.filter}
            callback={props.onMessageFilterCallback}
          />
        </div>
      </div>
      <Divider />
      <div className={classes.list}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              className="List"
              height={height}
              itemCount={props.messages.length}
              itemSize={getRowHeight}
              ref={listRef as LegacyRef<List>}
              width={width}
            >
              {({ index, style }) => (
                <ListItem
                  key={index}
                  index={index}
                  style={style}
                  setRowHeight={setRowHeight}
                  classes={classes}
                  message={props.messages[index]}
                  isLast={index === props.messages.length - 1}
                  viewRaw={props.viewRaw}
                />
              )}
            </List>
          )}
        </AutoSizer>
      </div>
    </Box>
  );
};

export default Messages;

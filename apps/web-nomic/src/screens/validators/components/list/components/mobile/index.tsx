import AvatarName from '@/components/avatar_name';
import { useList, useListRow } from '@/hooks';
import SingleValidator from '@/screens/validators/components/list/components/mobile/component/single_validator';
import VotingPower from '@/screens/validators/components/list/components/voting_power';
import type { ItemType } from '@/screens/validators/components/list/types';
import { getValidatorStatus } from '@/utils/get_validator_status';
import Divider from '@material-ui/core/Divider';
import classnames from 'classnames';
import numeral from 'numeral';
import React, { FC } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { ListChildComponentProps, VariableSizeList as List } from 'react-window';

type Props = {
  className?: string;
  items: ItemType[];
  search: string;
};

const ListItem: FC<
  Pick<ListChildComponentProps, 'index' | 'style'> & {
    setRowHeight: Parameters<typeof useListRow>[1];
    item: ItemType;
    items: ItemType[];
    search: string;
    i: number;
  }
> = ({ index, style, setRowHeight, item, items, search, i }) => {
  const { rowRef } = useListRow(index, setRowHeight);
  const { name, address, imageUrl } = item.validator;

  if (search) {
    const formattedSearch = search.toLowerCase().replace(/ /g, '');
    if (
      !name.toLowerCase().replace(/ /g, '').includes(formattedSearch) &&
      !address.toLowerCase().includes(formattedSearch)
    ) {
      return null;
    }
  }

  const status = getValidatorStatus(item.inActiveSet, item.jailed, item.tombstoned);
  const percentDisplay = item.inActiveSet
    ? `${numeral(item.votingPowerPercent.toFixed(6)).format('0.[00]')}%`
    : '0%';
  const votingPower = numeral(item.votingPower).format('0,0');
  const selectedItem = {
    idx: `#${i + 1}`,
    validator: <AvatarName address={address} imageUrl={imageUrl} name={name} />,
    commission: `${numeral(item.commission).format('0.[00]')}%`,
    votingPower: (
      <VotingPower
        percentDisplay={percentDisplay}
        percentage={item.votingPowerPercent}
        content={votingPower}
        topVotingPower={item.topVotingPower ?? false}
      />
    ),
    status,
  };
  return (
    <div style={style}>
      <div ref={rowRef}>
        <SingleValidator {...selectedItem} />
        {index !== items.length - 1 && <Divider />}
      </div>
    </div>
  );
};

const Mobile: FC<Props> = ({ className, items, search }) => {
  const { listRef, getRowHeight, setRowHeight } = useList();

  return (
    <div className={classnames(className)}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            className="List"
            height={height}
            itemCount={items.length}
            itemSize={getRowHeight}
            ref={listRef as React.LegacyRef<List>}
            width={width}
          >
            {({ index, style }) => (
              <ListItem
                key={items[index].validator.address}
                index={index}
                style={style}
                item={items[index]}
                items={items}
                setRowHeight={setRowHeight}
                search={search}
                i={index}
              />
            )}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

export default Mobile;

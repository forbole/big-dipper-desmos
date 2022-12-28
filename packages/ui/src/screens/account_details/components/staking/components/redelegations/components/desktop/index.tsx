import AvatarName from '@/components/avatar_name';
import { useProfileRecoil } from '@/recoil/profiles/hooks';
import { readDate } from '@/recoil/settings';
import { columns } from '@/screens/account_details/components/staking/components/redelegations/components/desktop/utils';
import type { ItemType } from '@/screens/account_details/components/staking/components/redelegations/types';
import dayjs, { formatDayJs } from '@/utils/dayjs';
import { formatNumber } from '@/utils/format_token';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import classnames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import { FC, ReactNode, useMemo } from 'react';
import { useRecoilValue } from 'recoil';

type Props = {
  className?: string;
  items: ItemType[];
};

const RedelegationsRow: FC<{ item: ItemType; i: number }> = ({ item, i }) => {
  const from = useProfileRecoil(item.from);
  const to = useProfileRecoil(item.to);
  const dateFormat = useRecoilValue(readDate);
  const formattedItem = useMemo<{ [key: string]: ReactNode }>(
    () => ({
      identifier: i,
      to: <AvatarName address={to.address} imageUrl={to.imageUrl} name={to.name} />,
      from: <AvatarName address={from.address} imageUrl={from.imageUrl} name={from.name} />,
      amount: item.amount
        ? `${formatNumber(
            item.amount.value,
            item.amount.exponent
          )} ${item.amount.displayDenom.toUpperCase()}`
        : '',
      completionTime: formatDayJs(dayjs.utc(item.completionTime), dateFormat),
    }),
    [i, to, from, item, dateFormat]
  );
  return (
    <TableRow key={`holders-row-${i}`}>
      {columns.map((column) => (
        <TableCell
          key={`holders-row-${i}-${column.key}`}
          align={column.align}
          style={{ width: `${column.width}%` }}
        >
          {formattedItem[column.key]}
        </TableCell>
      ))}
    </TableRow>
  );
};

const Desktop: FC<Props> = ({ className, items }) => {
  const { t } = useTranslation('accounts');
  return (
    <div className={classnames(className)}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.key}
                align={column.align}
                style={{ width: `${column.width}%` }}
              >
                {t(column.key)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items?.map((row, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <RedelegationsRow key={i} i={i} item={row} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Desktop;

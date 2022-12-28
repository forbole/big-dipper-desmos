/* eslint-disable no-nested-ternary */
import AvatarName from '@/components/avatar_name';
import { useProfileRecoil } from '@/recoil/profiles/hooks';
import { columns } from '@/screens/proposal_details/components/votes/components/desktop/utils';
import type { ItemType } from '@/screens/proposal_details/components/votes/types';
import { getVoteKey } from '@/screens/proposal_details/components/votes/utils';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import classnames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import { FC } from 'react';

type Props = {
  className?: string;
  items?: ItemType[];
};

const VoteRow: FC<{ i: number; item: ItemType }> = ({ i, item }) => {
  const { t } = useTranslation('proposals');
  const { name, address, imageUrl } = useProfileRecoil(item.user);
  return (
    <TableRow key={`holders-row-${i}`}>
      {columns.map((column) => (
        <TableCell
          // eslint-disable-next-line react/no-array-index-key
          key={`holders-row-${i}-${column.key}`}
          align={column.align}
          style={{ width: `${column.width}%` }}
        >
          {column.key === 'voter' ? (
            <AvatarName address={address} imageUrl={imageUrl} name={name} />
          ) : column.key === 'vote' ? (
            t(getVoteKey(item.vote))
          ) : null}
        </TableCell>
      ))}
    </TableRow>
  );
};

const Desktop: FC<Props> = ({ className, items }) => {
  const { t } = useTranslation('proposals');

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
            <VoteRow key={i} i={i} item={row} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Desktop;

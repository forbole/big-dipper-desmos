import { useStyles } from '@/screens/account_details/components/nfts/components/list/components/desktop/styles';
import { columns } from '@/screens/account_details/components/nfts/components/list/components/desktop/utils';
import type { OtherTokenType } from '@/screens/account_details/components/nfts/types';
import { NFT_DETAILS } from '@/utils/go_to_page';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import classnames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { FC } from 'react';

const Desktop: FC<{ className?: string; items: OtherTokenType[] }> = (props) => {
  const { t } = useTranslation('accounts');
  const classes = useStyles();
  const formattedItems = props.items.map((x, i) => ({
    key: `${x.identifier}-${i}`,
    identifier: x.identifier,
    nft: (
      <Link href={NFT_DETAILS(x.identifier)} passHref>
        <Typography variant="body1" className="value" component="a">
          {x.name}
        </Typography>
      </Link>
    ),
    type: x.type,
  }));

  return (
    <div className={classnames(props.className, classes.root)}>
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
          {formattedItems?.map((row) => (
            <TableRow key={row.key}>
              {columns.map((column) => (
                <TableCell
                  key={`holders-row-${row.key}-${column.key}`}
                  align={column.align}
                  style={{ width: `${column.width}%` }}
                >
                  {row[column.key as keyof typeof row]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Desktop;

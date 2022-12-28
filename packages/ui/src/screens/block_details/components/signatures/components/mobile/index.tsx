import AvatarName from '@/components/avatar_name';
import { useList, useListRow } from '@/hooks';
import { useProfileRecoil } from '@/recoil/profiles/hooks';
import { useStyles } from '@/screens/block_details/components/signatures/components/mobile/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import classnames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import React, { FC } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { ListChildComponentProps, VariableSizeList as List } from 'react-window';

type Props = {
  className?: string;
  signatures?: string[];
};

const ListItem: FC<
  Pick<ListChildComponentProps, 'index' | 'style'> & {
    setRowHeight: Parameters<typeof useListRow>[1];
    signatures: string[] | undefined;
  }
> = ({ index, style, setRowHeight, signatures }) => {
  const { t } = useTranslation('blocks');
  const classes = useStyles();
  const { rowRef } = useListRow(index, setRowHeight);
  const selectedItem = signatures?.[index];
  const { name, address, imageUrl } = useProfileRecoil(selectedItem ?? '');
  return (
    <div style={style}>
      <div ref={rowRef}>
        {/* single signature start */}
        <div className={classes.itemWrapper}>
          <div className={classes.item}>
            <Typography variant="h4" className="label">
              {t('validator')}
            </Typography>
            <AvatarName address={address ?? ''} imageUrl={imageUrl} name={name ?? ''} />
          </div>
        </div>
        {/* single signature end */}
        {!!signatures && index !== signatures.length - 1 && <Divider />}
      </div>
    </div>
  );
};

const Mobile: FC<Props> = ({ className, signatures }) => {
  const { listRef, getRowHeight, setRowHeight } = useList();
  const classes = useStyles();

  return (
    <div className={classnames(className, classes.root)}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            className="List"
            height={height}
            itemCount={signatures?.length ?? 0}
            itemSize={getRowHeight}
            ref={listRef as React.LegacyRef<List>}
            width={width}
          >
            {({ index, style }) => (
              <ListItem
                key={index}
                index={index}
                style={style}
                setRowHeight={setRowHeight}
                signatures={signatures}
              />
            )}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

export default Mobile;

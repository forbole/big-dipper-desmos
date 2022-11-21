import React from 'react';
import classnames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { TRANSACTIONS } from '@utils/go_to_page';
import Box from 'ui/components/box';
import NoData from '@components/no_data';
import { useScreenSize } from 'ui/hooks';
import { useStyles } from './styles';
import { useBlocks } from './hooks';
import type DesktopType from './components/desktop';
import type MobileType from './components/mobile';

const Desktop = dynamic(() => import('./components/desktop')) as typeof DesktopType;
const Mobile = dynamic(() => import('./components/mobile')) as typeof MobileType;

const Transactions: React.FC<ComponentDefault> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation('home');
  const { isDesktop } = useScreenSize();
  const { state } = useBlocks();
  return (
    <Box className={classnames(props.className)}>
      <div className={classes.label}>
        <Typography variant="h2">{t('latestTransactions')}</Typography>
        <Link href={TRANSACTIONS} passHref>
          <Typography variant="h4" className="button" component="a" aria-label="see more txs">
            {t('seeMore')}
          </Typography>
        </Link>
      </div>
      {!state.items.length ? (
        <NoData />
      ) : (
        <>
          {isDesktop ? <Desktop items={state.items} /> : <Mobile items={state.items} />}
          <Divider className={classes.mobile} />
          <Link href={TRANSACTIONS} passHref>
            <Typography
              variant="h4"
              component="a"
              aria-label="see more txs"
              className={classnames(classes.seeMoreFooter, classes.mobile, 'button')}
            >
              {t('seeMore')}
            </Typography>
          </Link>
        </>
      )}
    </Box>
  );
};

export default Transactions;

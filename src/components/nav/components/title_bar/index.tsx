import React from 'react';
import classnames from 'classnames';
import { useChainContext } from '@contexts';
import useTranslation from 'next-translate/useTranslation';
import { Typography } from '@material-ui/core';
import { useStyles } from './styles';
import { formatMarket } from './utils';

const TitleBar:React.FC<{
  className?: string;
  title: string;
}> = ({
  className, title,
}) => {
  const { t } = useTranslation('common');
  const classes = useStyles();
  const {
    market: {
      uiData,
    },
  } = useChainContext();

  const market = formatMarket({
    ...uiData,
  });

  return (
    <div className={classnames(className, classes.root)}>
      {
      title
        ? <Typography variant="h1">{title}</Typography>
        : <img src="/logo-desmos.png" className={classes.logo} alt="logo" />
      }
      <div className={classes.content}>
        {market.map((x) => (
          <div key={x.key} className={classes.item}>
            <Typography variant="body1" className="label">
              {t(x.key)}
            </Typography>
            <Typography variant="body1">
              {x.data}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TitleBar;

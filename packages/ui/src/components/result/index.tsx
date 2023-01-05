import useStyles from '@/components/result/styles';
import Typography from '@mui/material/Typography';
import { Cancel, CheckCircle } from '@mui/icons-material';
import useTranslation from 'next-translate/useTranslation';
import React, { FC } from 'react';

type ResultProps = {
  className?: string;
  success?: boolean;
};

const Result: FC<ResultProps> = ({ className, success }) => {
  const { t } = useTranslation('common');
  const { classes, cx } = useStyles();

  return (
    <div
      className={cx(className, classes.root, {
        [classes.success]: success,
        [classes.fail]: !success,
      })}
    >
      {success ? (
        <>
          <CheckCircle />
          <Typography variant="body1">{t('success')}</Typography>
        </>
      ) : (
        <>
          <Cancel />
          <Typography variant="body1">{t('fail')}</Typography>
        </>
      )}
    </div>
  );
};

export default Result;

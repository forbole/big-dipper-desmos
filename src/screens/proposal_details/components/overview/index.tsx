import React from 'react';
import classnames from 'classnames';
import dayjs from '@utils/dayjs';
import useTranslation from 'next-translate/useTranslation';
import {
  Typography,
  Divider,
} from '@material-ui/core';
import {
  SingleProposal,
  AvatarName,
  Box,
  Tag,
} from '@components';

import { useStyles } from './styles';
import { useProposalContext } from '../../contexts/proposal';

const Overview: React.FC<{
  className?: string;
}> = ({ className }) => {
  const classes = useStyles();
  const { t } = useTranslation('proposals');
  const { uiData } = useProposalContext();
  console.log(uiData, 'ui data');

  // const formatItem = {
  //   id: `#${item.id}`,
  //   proposer: (
  //     <AvatarName
  //       address={item?.proposer?.identity || ''}
  //       imageUrl={item?.proposer?.image || ''}
  //       name={item?.proposer?.moniker || ''}
  //     />
  //   ),
  //   title: item.title,
  //   submissionTime: dayjs(item.submissionTime).format('YYYY-MM-DD'),
  //   votingTimeStart: dayjs(item.votingTimeStart).format('YYYY-MM-DD'),
  //   status: (
  //     <Tag theme="one" value="status" />
  //   ),
  // };

  return (
    <Box className={classnames(className)}>
      <SingleProposal
        id={uiData.overview.id}
        title={uiData.overview.title}
        status={uiData.overview.status}
      />
      <Divider />
      <div className={classes.content}>
        <Typography variant="body1" className="label">
          {t('type')}
        </Typography>
        <Typography variant="body1" className="value">
          TYPE TYPE
        </Typography>
        <Typography variant="body1" className="label">
          {t('description')}
        </Typography>
        <Typography variant="body1" className="value">
          {uiData.overview.description}
        </Typography>
      </div>
    </Box>
  );
};

export default Overview;

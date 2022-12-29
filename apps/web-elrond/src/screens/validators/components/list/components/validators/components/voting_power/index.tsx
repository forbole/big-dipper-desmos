import React, { FC } from 'react';
import classnames from 'classnames';
import Typography from '@material-ui/core/Typography';
import { useStyles } from '@/screens/validators/components/list/components/validators/components/voting_power/styles';

type VotingPowerProps = {
  className?: string;
  percentage: number;
  percentDisplay: string;
  content: string;
};

const VotingPower: FC<VotingPowerProps> = ({ className, percentage, content, percentDisplay }) => {
  const classes = useStyles(percentage);
  return (
    <div className={classnames(className, classes.root)}>
      <div className={classes.content}>
        <Typography variant="body1">{content}</Typography>
        <Typography variant="body1" className="percentage">
          {percentDisplay}
        </Typography>
      </div>
      <div className={classes.chart}>
        <div className={classes.active} />
      </div>
    </div>
  );
};

export default VotingPower;

import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import useAppTranslation from '@/hooks/useAppTranslation';
import numeral from 'numeral';
import * as R from 'ramda';
import { FC, useCallback, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import Box from '@/components/box';
import Markdown from '@/components/markdown';
import Name from '@/components/name';
import SingleProposal from '@/components/single_proposal';
import { useProfileRecoil } from '@/recoil/profiles/hooks';
import { readDate, readTimeFormat } from '@/recoil/settings';
import CommunityPoolSpend from '@/screens/proposal_details/components/overview/components/community_pool_spend';
import UpdateParams from '@/screens/proposal_details/components/overview/components/update_params';
import ParamsChange from '@/screens/proposal_details/components/overview/components/params_change';
import SoftwareUpgrade from '@/screens/proposal_details/components/overview/components/software_upgrade';
import type { OverviewType } from '@/screens/proposal_details/types';
import { getProposalType } from '@/screens/proposal_details/utils';
import dayjs, { formatDayJs } from '@/utils/dayjs';
import { formatNumber, formatToken } from '@/utils/format_token';
import useStyles from './styles';

const Overview: FC<{ className?: string; overview: OverviewType }> = ({ className, overview }) => {
  const dateFormat = useRecoilValue(readDate);
  const timeFormat = useRecoilValue(readTimeFormat);
  const { classes, cx } = useStyles();
  const { t } = useAppTranslation('proposals');

  const types = useMemo(() => {
    if (Array.isArray(overview.content)) {
      const typeArray: string[] = [];
      overview.content.forEach((type: { params: JSON; type: string }) =>
        typeArray.push(getProposalType(R.pathOr('', ['@type'], type)))
      );
      return typeArray;
    }
    const typeArray: string[] = [];
    typeArray.push(getProposalType(R.pathOr('', ['@type'], overview.content)));
    return typeArray;
  }, [overview.content]);

  const changes = useMemo(() => {
    const changeList: any[] = [];
    if (Array.isArray(overview.content)) {
      overview.content.forEach((type: { params: JSON; type: string }) => {
        changeList.push({ params: type.params, type: R.pathOr('', ['@type'], type) });
      });

      return changeList;
    }
    return changeList;
  }, [overview.content]);

  const { address: proposerAddress, name: proposerName } = useProfileRecoil(overview.proposer);
  const { name: recipientName } = useProfileRecoil(overview?.content?.recipient);
  const proposerMoniker = proposerName || overview.proposer;
  const recipientMoniker = recipientName || overview?.content?.recipient;
  const amountRequested = overview.content?.amount
    ? formatToken(overview.content?.amount[0]?.amount, overview.content?.amount[0]?.denom)
    : null;
  const parsedAmountRequested = amountRequested
    ? `${formatNumber(
        amountRequested.value,
        amountRequested.exponent
      )} ${amountRequested.displayDenom.toUpperCase()}`
    : '';

  const getExtraDetails = useCallback(() => {
    let extraDetails = null;
    types.forEach((type: string) => {
      if (type === 'parameterChangeProposal') {
        extraDetails = (
          <>
            <Typography variant="body1" className="label">
              {t('changes')}
            </Typography>
            <ParamsChange changes={R.pathOr([], ['changes'], overview.content)} />
          </>
        );
      }
      if (type === 'softwareUpgradeProposal') {
        extraDetails = (
          <>
            <Typography variant="body1" className="label">
              {t('plan')}
            </Typography>
            <SoftwareUpgrade
              height={R.pathOr('0', ['plan', 'height'], overview.content)}
              info={R.pathOr('', ['plan', 'info'], overview.content)}
              name={R.pathOr('', ['plan', 'name'], overview.content)}
            />
          </>
        );
      }
      if (type === 'communityPoolSpendProposal') {
        extraDetails = (
          <>
            <Typography variant="body1" className="label">
              {t('content')}
            </Typography>
            <CommunityPoolSpend
              recipient={overview?.content?.recipient}
              recipientMoniker={recipientMoniker}
              amountRequested={parsedAmountRequested}
            />
          </>
        );
      }

      if (type.includes('MsgUpdateParams')) {
        extraDetails = (
          <>
            {changes.map((change) => (
              <UpdateParams changes={change} className="accordion" />
            ))}
          </>
        );
      }
    });
    return extraDetails;
  }, [changes, overview.content, parsedAmountRequested, recipientMoniker, t, types]);

  const extra = getExtraDetails();

  return (
    <Box className={cx(classes.root, className)}>
      <SingleProposal
        id={`#${numeral(overview.id).format('0,0')}`}
        title={overview.title}
        status={overview.status}
      />
      <Divider />
      <div className={classes.content}>
        <Typography variant="body1" className="label">
          {t('type')}
        </Typography>
        <Typography variant="body1">
          {types.map((type: string) => (
            <Typography variant="body1" className="value" key={type}>
              {t(type)}
            </Typography>
          ))}
        </Typography>
        <Typography variant="body1" className="label">
          {t('proposer')}
        </Typography>
        <Name name={proposerMoniker} address={proposerAddress} />
        {!!overview.submitTime && (
          <>
            <Typography variant="body1" className="label">
              {t('submitTime')}
            </Typography>
            <Typography variant="body1" className="value">
              {formatDayJs(dayjs.utc(overview.submitTime), dateFormat, timeFormat)}
            </Typography>
          </>
        )}
        {!!overview.depositEndTime && (
          <>
            <Typography variant="body1" className="label">
              {t('depositEndTime')}
            </Typography>
            <Typography variant="body1" className="value">
              {formatDayJs(dayjs.utc(overview.depositEndTime), dateFormat, timeFormat)}
            </Typography>
          </>
        )}
        {!!overview.votingStartTime && (
          <>
            <Typography variant="body1" className="label">
              {t('votingStartTime')}
            </Typography>
            <Typography variant="body1" className="value">
              {formatDayJs(dayjs.utc(overview.votingStartTime), dateFormat, timeFormat)}
            </Typography>
          </>
        )}
        {!!overview.votingEndTime && (
          <>
            <Typography variant="body1" className="label">
              {t('votingEndTime')}
            </Typography>
            <Typography variant="body1" className="value">
              {formatDayJs(dayjs.utc(overview.votingEndTime), dateFormat, timeFormat)}
            </Typography>
          </>
        )}
        <Typography variant="body1" className="label">
          {t('description')}
        </Typography>
        <Markdown markdown={overview.description} />
        {extra}
      </div>
    </Box>
  );
};

export default Overview;

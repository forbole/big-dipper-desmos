import Name from '@/components/name';
import MsgSetRegistry from '@/models/msg/tokenregistry/msg_set_registry';
import { useProfileRecoil } from '@/recoil/profiles/hooks';
import Typography from '@mui/material/Typography';
import { Trans, useTranslation } from 'next-i18next';
import { FC } from 'react';

const SetRegistry: FC<{ message: MsgSetRegistry }> = (props) => {
  const { t } = useTranslation('transactions');
  const { message } = props;

  const from = useProfileRecoil(message.from);
  const fromMoniker = from ? from?.name : message.from;

  const parsedDenoms = message?.registry
    ?.map((x) => x.denom.toUpperCase())
    .reduce(
      (text, value, i, array) => text + (i < array.length - 1 ? ', ' : ` ${t('and')} `) + value
    );

  return (
    <Typography>
      <Trans
        i18nKey="message_contents:MsgSetRegistry"
        components={[<Name address={message.from} name={fromMoniker} />, <b />]}
        values={{
          denoms: parsedDenoms,
        }}
      />
    </Typography>
  );
};

export default SetRegistry;

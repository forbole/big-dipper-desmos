import Typography from '@mui/material/Typography';
import { Trans } from 'next-i18next';
import { FC } from 'react';
import Name from '@/components/name';
import MsgEditDataSource from '@/models/msg/oracle/msg_edit_data_source';
import { useProfileRecoil } from '@/recoil/profiles/hooks';

const EditDataSource: FC<{ message: MsgEditDataSource }> = (props) => {
  const { message } = props;

  const sender = useProfileRecoil(message.sender);
  const senderMoniker = sender ? sender?.name : message.sender;

  return (
    <Typography>
      <Trans
        i18nKey="chain_band:message_contents_txEditDataSource"
        components={[<Name address={message.sender} name={senderMoniker} />, <b />]}
        values={{
          name: message.name,
        }}
      />
    </Typography>
  );
};

export default EditDataSource;

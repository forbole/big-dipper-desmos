import { FC } from 'react';
import { useProfileRecoil } from '@/recoil/profiles';
import { Typography } from '@mui/material';
import { Trans } from 'react-i18next';
import Name from '@/components/name';
import { MsgNftMint } from '@/models';

const NftMint: FC<{ message: MsgNftMint }> = (props) => {
  const { message } = props;

  const sender = useProfileRecoil(message.sender);

  return (
    <Typography>
      <Trans
        i18nKey="message_contents:msgNftMintContent"
        components={[
          <Name address={message.sender} name={sender.name ?? message.sender} />,
          <b />,
          <b />,
        ]}
        values={{
          sender: message.sender,
          id: message.id,
          class_id: message.class_id,
        }}
      />
    </Typography>
  );
};

export default NftMint;

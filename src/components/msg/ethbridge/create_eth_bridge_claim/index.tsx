import React from 'react';
import Trans from 'next-translate/Trans';
import { Typography } from '@material-ui/core';
import { Name } from '@components';
import { MsgCreateEthBridgeClaim } from '@models';
import {
  useProfileRecoil,
} from '@recoil/profiles';

const CreateEthBridgeClaim = (props: {
  message: MsgCreateEthBridgeClaim;
}) => {
  const { message } = props;

  const cosmosreceiver = useProfileRecoil(message.ethBridgeClaim.cosmosreceiver);
  const cosmosreceiverMoniker = cosmosreceiver
    ? cosmosreceiver?.name : message.ethBridgeClaim.cosmosreceiver;

  return (
    <Typography>
      <Trans
        i18nKey="message_contents:MsgCreateEthBridgeClaim"
        components={[
          (
            <Name
              address={message.ethBridgeClaim.cosmosreceiver}
              name={cosmosreceiverMoniker}
            />
          ),
          <b />,
        ]}
      />
    </Typography>
  );
};

export default CreateEthBridgeClaim;

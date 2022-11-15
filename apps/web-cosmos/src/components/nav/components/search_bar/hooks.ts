import numeral from 'numeral';
import chainConfig from 'ui/chainConfig';
import { useRouter } from 'next/router';
import {
  VALIDATOR_DETAILS,
  ACCOUNT_DETAILS,
  BLOCK_DETAILS,
  TRANSACTION_DETAILS,
  PROFILE_DETAILS,
} from 'ui/utils/go_to_page';
import { useRecoilCallback } from 'recoil';
import { readValidator } from '@recoil/validators';
import { toast } from 'react-toastify';
import { isValidAddress } from 'ui/utils/prefix_convert';
import { Translate } from 'next-translate';

export const useSearchBar = (t: Translate) => {
  const router = useRouter();

  const handleOnSubmit = useRecoilCallback(
    ({ snapshot }) =>
      async (value: string, clear?: () => void) => {
        const consensusRegex = `^(${chainConfig.prefix.consensus})`;
        const validatorRegex = `^(${chainConfig.prefix.validator})`;
        const userRegex = `^(${chainConfig.prefix.account})`;
        const parsedValue = value.replace(/\s+/g, '');

        if (new RegExp(consensusRegex).test(parsedValue)) {
          const validatorAddress = await snapshot.getPromise(readValidator(parsedValue));
          if (validatorAddress) {
            router.push(VALIDATOR_DETAILS(validatorAddress.validator));
          } else {
            toast(t('common:useValidatorAddress'));
          }
        } else if (new RegExp(validatorRegex).test(parsedValue)) {
          if (isValidAddress(parsedValue)) {
            router.push(VALIDATOR_DETAILS(parsedValue));
          } else {
            toast(t('common:invalidAddress'));
          }
        } else if (new RegExp(userRegex).test(parsedValue)) {
          if (isValidAddress(parsedValue)) {
            router.push(ACCOUNT_DETAILS(parsedValue));
          } else {
            toast(t('common:invalidAddress'));
          }
        } else if (/^@/.test(parsedValue)) {
          const configProfile = chainConfig.extra.profile;
          if (!configProfile) {
            toast(t('common:profilesNotEnabled'));
          } else if (parsedValue === '@') {
            toast(t('common:insertValidDtag'));
          } else {
            router.push(PROFILE_DETAILS(parsedValue));
          }
        } else if (/^-?\d+$/.test(String(numeral(parsedValue).value()))) {
          router.push(BLOCK_DETAILS(String(numeral(parsedValue).value())));
        } else {
          router.push(TRANSACTION_DETAILS(parsedValue));
        }

        if (clear) {
          clear();
        }
      }
  );

  return {
    handleOnSubmit,
  };
};
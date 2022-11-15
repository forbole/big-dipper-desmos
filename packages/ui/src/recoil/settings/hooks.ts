import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import chainConfig from 'ui/chainConfig';
import { getItem, THEME_KEY, DATE_KEY, TX_KEY } from 'ui/utils/localstorage';
import { atomState } from './atom';
import { THEME_DICTIONARY } from './utils';
import type { AtomState, Theme } from './types';

export const useSettingsRecoil = () => {
  const [settings, setSettings] = useRecoilState(atomState);

  useEffect(() => {
    const isClient = typeof window === 'object';
    if (isClient) {
      const savedTheme = getItem(THEME_KEY, 'device');
      let currentTheme: Theme = settings.theme;
      if (savedTheme === 'device') {
        if (
          chainConfig.themes.themeList.includes('dark') &&
          window?.matchMedia('(prefers-color-scheme: dark)')?.matches
        ) {
          currentTheme = 'dark';
        }
      } else if (THEME_DICTIONARY[savedTheme]) {
        currentTheme = savedTheme;
      }

      const savedDate = getItem(DATE_KEY, settings.dateFormat);
      const savedTx = getItem(TX_KEY, settings.txListFormat);
      const initSettings: AtomState = {
        theme: currentTheme,
        dateFormat: savedDate,
        txListFormat: savedTx,
      };
      setSettings(initSettings);
    }
  }, []);
};
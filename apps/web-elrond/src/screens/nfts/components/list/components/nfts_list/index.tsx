import React from 'react';
import dynamic from 'next/dynamic';
import NoData from '@components/no_data';
import { useScreenSize } from '@hooks';
import type { NFTTypes } from '../../types';
import type DesktopType from './components/desktop';
import type MobileType from './components/mobile';

const Desktop = dynamic(() => import('./components/desktop')) as typeof DesktopType;
const Mobile = dynamic(() => import('./components/mobile')) as typeof MobileType;

const NftsList: React.FC<{ items: NFTTypes[] } & ComponentDefault> = (props) => {
  const { isDesktop } = useScreenSize();

  if (!props.items.length) {
    return <NoData />;
  }

  return <>{isDesktop ? <Desktop items={props.items} /> : <Mobile items={props.items} />}</>;
};

export default NftsList;

import ActionBar from '@/components/nav/components/desktop/components/action_bar';
import { useDesktop } from '@/components/nav/components/desktop/hooks';
import { useStyles } from '@/components/nav/components/desktop/styles';
import MenuItems from '@/components/nav/components/menu_items';
import TitleBar from '@/components/nav/components/title_bar';
import { readTheme } from '@/recoil/settings';
import AppBar from '@mui/material/AppBar';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Drawer from '@mui/material/Drawer';
import classnames from 'classnames';
import React, { FC } from 'react';
import { useRecoilValue } from 'recoil';
import BigDipperLogoRed from 'shared-utils/assets/big-dipper-red-sifchain.svg';
import BigDipperLogoWhite from 'shared-utils/assets/big-dipper-white.svg';

type DesktopProps = {
  className?: string;
  title: string;
};

const Desktop: FC<DesktopProps> = ({ className, title }) => {
  const classes = useStyles();
  const theme = useRecoilValue(readTheme);
  const { isMenu, toggleMenu, turnOffAll, toggleNetwork, isNetwork } = useDesktop();
  return (
    <ClickAwayListener onClickAway={turnOffAll}>
      <div className={classnames(className, classes.root)}>
        <AppBar
          position="fixed"
          className={classnames(classes.appBar, {
            open: isMenu,
          })}
        >
          <ActionBar toggleNetwork={toggleNetwork} isNetwork={isNetwork} />
          <TitleBar title={title} />
        </AppBar>
        <Drawer
          variant="permanent"
          className={classnames(classes.drawer, {
            open: isMenu,
            closed: !isMenu,
            [classes.drawerOpen]: isMenu,
            [classes.drawerClose]: !isMenu,
          })}
          classes={{
            paper: classnames({
              open: isMenu,
              closed: !isMenu,
              [classes.drawerOpen]: isMenu,
              [classes.drawerClose]: !isMenu,
            }),
          }}
        >
          {theme === 'light' ? (
            <BigDipperLogoRed className={classes.logo} onClick={toggleMenu} role="button" />
          ) : (
            <BigDipperLogoWhite className={classes.logo} onClick={toggleMenu} role="button" />
          )}
          <MenuItems />
        </Drawer>
      </div>
    </ClickAwayListener>
  );
};

export default Desktop;

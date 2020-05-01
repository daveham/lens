import React from 'react';
import DropDownMenu, { TMenuItem } from 'editor/components/dropDownMenu';
import { withStyles } from '@material-ui/core/styles';

// import getDebugLog from './debugLog';
// const debug = getDebugLog('guideMenus');

const styles: any = ({ spacing, palette }) => {
  return {
    guideMenu: {
      backgroundColor: palette.primary.dark,
      color: palette.primary.contrastText,
    },
    guideMenuItem: {
      backgroundColor: palette.primary.dark,
      color: palette.primary.contrastText,
      fontSize: '.8rem',
      height: 20,
      paddingTop: spacing(.5),
      paddingBottom: spacing(.5),
    },
  };
};

interface IProps {
  classes?: any;
  disabled?: boolean;
  menuItems: ReadonlyArray<TMenuItem>;
  onMenuSelection: (menuItem: TMenuItem) => void;
}

export const GuideMenu = ({ classes, disabled, menuItems, onMenuSelection }: IProps): any => (
  <DropDownMenu
    onMenuSelection={onMenuSelection}
    id='guideMenu'
    disabled={disabled}
    menuItems={menuItems}
    menuClasses={classes.guideMenu}
    menuItemClasses={classes.guideMenuItem}
  />
);

export default withStyles(styles)(GuideMenu);

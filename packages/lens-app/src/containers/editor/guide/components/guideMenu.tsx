import React from 'react';
import DropDownMenu, { TMenuItem } from 'editor/components/dropDownMenu';
import { withStyles } from '@material-ui/core/styles';

// import _debug from 'debug';
// const debug = _debug('lens:editor:guide:menu');

const styles: any = ({ spacing: { unit }, palette }) => {
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
      paddingTop: unit / 2,
      paddingBottom: unit / 2,
    },
  };
};

interface IProps {
  classes?: any;
  disabled?: boolean;
  menuItems: ReadonlyArray<TMenuItem>;
  onMenuSelection: (menuItem: TMenuItem) => {};
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

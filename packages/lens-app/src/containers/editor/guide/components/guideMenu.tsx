import React from 'react';
import DropDownMenu from 'editor/components/dropDownMenu';
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
  menuItems: ReadonlyArray<string>;
  onMenuSelection: (index: number) => {};
}

export const GuideMenu = ({
  classes,
  menuItems,
  onMenuSelection,
}: IProps): any => (
  <DropDownMenu
    onMenuSelection={onMenuSelection}
    id='guideMenu'
    menuItems={menuItems}
    menuClasses={classes.guideMenu}
    menuItemClasses={classes.guideMenuItem}
  />
);

export default withStyles(styles)(GuideMenu);

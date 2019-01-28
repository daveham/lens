import React from 'react';
import DropDownMenu from 'editor/components/dropDownMenu';
import { withStyles } from '@material-ui/core/styles';

// import _debug from 'debug';
// const debug = _debug('lens:editor:guide:menu');

const styles: any = ({ spacing: { unit } /* , palette */ }) => {
  return {
    // listMenu: {
    //   backgroundColor: palette.primary.dark,
    //   color: palette.primary.contrastText,
    // },
    listMenuItem: {
      // color: palette.primary.contrastText,
      fontSize: '.8rem',
      height: 20,
      paddingTop: unit / 2,
      paddingBottom: unit / 2,
    },
    listMenuButton: {
      padding: unit / 2,
    },
    listMenuIcon: {
      fontSize: '14px',
    },
  };
};

interface IProps {
  classes?: any;
  id: string;
  menuItems: ReadonlyArray<string>;
  onMenuSelection: (index: number) => {};
}

export const GuideListMenu = ({
  classes,
  id,
  menuItems,
  onMenuSelection,
}: IProps): any => (
  <DropDownMenu
    onMenuSelection={onMenuSelection}
    id={id}
    menuItems={menuItems}
    // menuClasses={classes.listMenu}
    menuItemClasses={classes.listMenuItem}
    menuIconClasses={classes.listMenuIcon}
    menuButtonClasses={classes.listMenuButton}
  />
);

export default withStyles(styles)(GuideListMenu);

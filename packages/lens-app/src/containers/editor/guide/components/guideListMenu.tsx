import React from 'react';
import DropDownMenu, { TMenuItem } from 'editor/components/dropDownMenu';
import { withStyles } from '@material-ui/core/styles';

// import _debug from 'debug';
// const debug = _debug('lens:editor:guide:menu');

const styles: any = ({ spacing: { unit } }) => {
  return {
    listMenuButton: {
      padding: unit,
    },
    listMenuIcon: {
      fontSize: '16px',
    },
    listMenuItem: {
      fontSize: '.8rem',
      height: unit * 1.5,
      paddingTop: unit / 2,
      paddingBottom: unit / 2,
    },
  };
};

interface IProps {
  classes?: any;
  id: string;
  disabled?: boolean;
  menuItems: ReadonlyArray<TMenuItem>;
  onMenuSelection: (menuItem: TMenuItem) => void;
}

export const GuideListMenu = ({
  classes,
  id,
  disabled,
  menuItems,
  onMenuSelection,
}: IProps): any => (
  <DropDownMenu
    onMenuSelection={onMenuSelection}
    id={id}
    disabled={disabled}
    menuItems={menuItems}
    menuItemClasses={classes.listMenuItem}
    menuIconClasses={classes.listMenuIcon}
    menuButtonClasses={classes.listMenuButton}
  />
);

export default withStyles(styles)(GuideListMenu);

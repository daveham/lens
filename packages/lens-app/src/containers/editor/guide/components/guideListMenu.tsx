import React from 'react';
import DropDownMenu, { TMenuItem } from 'editor/components/dropDownMenu';
import { withStyles } from '@material-ui/core/styles';

// import getDebugLog from './debugLog';
// const debug = getDebugLog('guideListMenu');

const styles: any = ({ spacing }) => {
  return {
    listMenuButton: {
      padding: spacing(1),
    },
    listMenuIcon: {
      fontSize: '16px',
    },
    listMenuItem: {
      fontSize: '15px', // '.8rem',
      height:spacing(2),
      paddingTop: spacing(1.5),
      paddingBottom: spacing(1.5),
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

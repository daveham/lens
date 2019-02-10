import React, { Fragment } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import _debug from 'debug';
const debug = _debug('lens:editor:dropDownMenu');

const styles: any = ({ spacing: { unit }, palette }) => {
  return {
    menu: {
      backgroundColor: palette.background.default,
      color: palette.text.primary,
    },
    menuButton: {
      padding: unit * 1.5,
    },
    menuIcon: {
      fontSize: '24px',
    },
    menuItem: {
      backgroundColor: palette.background.default,
      color: palette.text.primary,
      fontSize: '1rem',
      height: 2.5 * unit,
      paddingTop: unit,
      paddingBottom: unit,
    },
  };
};

export interface IMenuItem {
  label: string;
  value?: any;
  disabled?: boolean;
}

export type TMenuItem = IMenuItem | string;

interface IProps {
  classes?: any;
  children?: any;
  id: string;
  menuClasses?: object;
  menuItemClasses?: object;
  menuButtonClasses?: object;
  menuIconClasses?: object;
  anchorOrigin?: any;
  transformOrigin?: any;
  menuItems: ReadonlyArray<TMenuItem>;
  disabled?: boolean;
  onMenuSelection: (menuItem: TMenuItem) => {};
  onMenuEnter?: (id: string) => {};
}

interface IState {
  anchorElement?: HTMLElement;
  closedAfterOpen: boolean;
}

export class DropDownMenu extends React.Component<IProps, IState> {
  private suppressStateChanges;

  constructor(props) {
    super(props);
    this.state = {
      anchorElement: null,
      closedAfterOpen: true,
    };
    this.suppressStateChanges = false;
  }

  public componentWillUnmount(): void {
    this.suppressStateChanges = true;
  }

  public render(): any {
    const {
      classes,
      children,
      id,
      disabled,
      menuClasses,
      menuButtonClasses,
      menuItemClasses,
      menuIconClasses,
      anchorOrigin,
      transformOrigin,
      menuItems,
    } = this.props;

    const { anchorElement, closedAfterOpen } = this.state;
    const menuOpen = Boolean(anchorElement);

    const menuPaperClass = cx(classes.menu, menuClasses);
    const menuItemRootClass = cx(classes.menuItem, menuItemClasses);
    const menuButtonRootClass = cx(classes.menuButton, menuButtonClasses);
    const menuIconRootClass = cx(classes.menuIcon, menuIconClasses);

    const menuAnchorOrigin = anchorOrigin || { horizontal: 'left', vertical: 'bottom' };
    const menuTransformOrigin = transformOrigin || { horizontal: 'left', vertical: 'top' };

    const menuAnchor = children || <MoreVertIcon classes={{ root: menuIconRootClass }} />;

    const showMenu = menuOpen || (!menuOpen && !closedAfterOpen);
    const menuItemElements =
      showMenu &&
      menuItems.map((item, index) =>
        item === '-' ? (
          <Divider key={`menu-item-divider-${index}`} />
        ) : (
          <MenuItem
            classes={{ root: menuItemRootClass }}
            dense
            disabled={(item as IMenuItem).disabled}
            key={`menu-item-${(item as IMenuItem).value || (item as IMenuItem).label}`}
            onClick={this.handleMenuItemClick(index)}
          >
            {(item as IMenuItem).label}
          </MenuItem>
        ),
      );

    return (
      <Fragment>
        <IconButton
          disabled={disabled}
          onClick={this.handleMenuButtonClick}
          classes={{ root: menuButtonRootClass }}
        >
          {menuAnchor}
        </IconButton>
        <Menu
          classes={{ paper: menuPaperClass }}
          anchorOrigin={menuAnchorOrigin}
          transformOrigin={menuTransformOrigin}
          id={id}
          disableAutoFocusItem
          anchorEl={anchorElement}
          getContentAnchorEl={null}
          open={menuOpen}
          onClose={this.handleMenuClose}
          onClick={this.handleMenuClick}
          onEnter={this.handleMenuEnter}
        >
          {menuItemElements}
        </Menu>
      </Fragment>
    );
  }

  private handleMenuButtonClick = ({ currentTarget }) => {
    debug('handleMenuButtonClick', { currentTarget });
    this.setState({ anchorElement: currentTarget });
  };

  private handleMenuClick = ({ currentTarget }) => {
    debug('handleMenuClick', { currentTarget });
    this.setState({
      anchorElement: null,
      closedAfterOpen: false,
    });
    // defer actual close to allow for animations
    setTimeout(() => {
      if (!this.suppressStateChanges) {
        this.setState({
          closedAfterOpen: true,
        });
      }
    }, 250);
  };

  private handleMenuClose = ({ currentTarget }) => {
    debug('handleMenuClose', { currentTarget });
    this.setState({
      closedAfterOpen: true,
    });
  };

  private handleMenuEnter = () => {
    debug('handleMenuEnter', { id: this.props.id });
    const { id, onMenuEnter } = this.props;
    if (onMenuEnter) {
      onMenuEnter(id);
    }
  };

  private handleMenuItemClick = index => () => {
    debug('handleMenuItemClick', {
      menuItem: this.props.menuItems[index],
    });
    this.setState({ anchorElement: null });
    this.props.onMenuSelection(this.props.menuItems[index]);
  };
}

export default withStyles(styles)(DropDownMenu);

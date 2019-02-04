import React, { Fragment } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
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
  menuItems: ReadonlyArray<string>;
  onMenuSelection: (index: number) => {};
}

interface IState {
  anchorElement?: HTMLElement;
  closedAfterOpen: boolean;
}

export class DropDownMenu extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      anchorElement: null,
      closedAfterOpen: true,
    };
  }

  public render(): any {
    const {
      classes,
      children,
      id,
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

    const menuAnchor = children ||
      <MoreVertIcon classes={{ root: menuIconRootClass }} />;

    const showMenu = menuOpen || (!menuOpen && !closedAfterOpen);
    const menuItemElements = showMenu && menuItems.map((item, index) => (
      <MenuItem
        classes={{ root: menuItemRootClass }}
        dense
        key={`menu-item-${item}`}
        onClick={this.handleMenuItemClick(index)}
      >
        {item}
      </MenuItem>
    ));

    return (
      <Fragment>
        <IconButton onClick={this.handleMenuButtonClick} classes={{ root: menuButtonRootClass }}>
          {menuAnchor}
        </IconButton>
        <Menu
          classes={{ paper: menuPaperClass }}
          anchorOrigin={menuAnchorOrigin}
          transformOrigin={menuTransformOrigin}
          id={id}
          anchorEl={anchorElement}
          getContentAnchorEl={null}
          open={menuOpen}
          onClose={this.handleMenuClose}
          onClick={this.handleMenuClick}
          onEntering={this.handleMenuEntering}
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
      this.setState({
        closedAfterOpen: true,
      });
    }, 250);
  };

  private handleMenuClose = ({ currentTarget }) => {
    debug('handleMenuClose', { currentTarget });
    this.setState({
      closedAfterOpen: true,
    });
  };

  private handleMenuEntering = () => {
    // debug('handleMenuEntering', { id });
  };

  private handleMenuItemClick = (index) => () => {
    debug('handleMenuItemClick', { index, menuItem: this.props.menuItems[index] });
    this.setState({ anchorElement: null });
    this.props.onMenuSelection(index);
  };
}

export default withStyles(styles)(DropDownMenu);

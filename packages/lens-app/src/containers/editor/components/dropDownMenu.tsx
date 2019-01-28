import React, { Fragment } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';

// import _debug from 'debug';
// const debug = _debug('lens:editor:dropDownMenu');

const styles: any = ({ spacing: { unit }, palette }) => {
  return {
    menu: {
      backgroundColor: palette.background.default,
      color: palette.text.primary,
    },
    menuItem: {
      backgroundColor: palette.background.default,
      color: palette.text.primary,
      fontSize: '.8rem',
      height: 2.5 * unit,
      paddingTop: unit / 2,
      paddingBottom: unit / 2,
    },
    menuButton: {
      padding: unit * 1.5,
    },
    menuIcon: {
      fontSize: '24px',
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
}

export class DropDownMenu extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      anchorElement: null,
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
    const { anchorElement } = this.state;
    const menuOpen = Boolean(anchorElement);

    const menuPaperClass = cx(classes.menu, menuClasses);
    const menuItemRootClass = cx(classes.menuItem, menuItemClasses);
    const menuButtonRootClass = cx(classes.menuButton, menuButtonClasses);
    const menuIconRootClass = cx(classes.menuIcon, menuIconClasses);

    const menuAnchorOrigin = anchorOrigin || { horizontal: 'left', vertical: 'bottom' };
    const menuTransformOrigin = transformOrigin || { horizontal: 'left', vertical: 'top' };

    const menuAnchor = children ||
      <MoreVertIcon classes={{ root: menuIconRootClass }} />;

    const menuItemElements = menuItems.map((item, index) => (
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
        <IconButton onClick={this.handleMenuClick} classes={{ root: menuButtonRootClass }}>
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
          onClick={this.handleMenuClose}
        >
          {menuItemElements}
        </Menu>
      </Fragment>
    );
  }

  private handleMenuClick = (event) => {
    this.setState({ anchorElement: event.currentTarget });
  };

  private handleMenuClose = () => {
    this.setState({ anchorElement: null });
  };

  private handleMenuItemClick = (index) => () => {
    this.handleMenuClose();
    this.props.onMenuSelection(index);
  };
}

export default withStyles(styles)(DropDownMenu);

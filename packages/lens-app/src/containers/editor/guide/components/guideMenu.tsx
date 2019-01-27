import React, { Fragment } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { withStyles } from '@material-ui/core/styles';

import _debug from 'debug';
const debug = _debug('lens:editor:guide:menu');

const styles: any = (theme) => {
  const { unit } = theme.spacing;
  return {
    guideMenu: {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
    },
    guideMenuItem: {
      color: theme.palette.primary.contrastText,
      fontSize: '.8rem',
      height: 20,
      paddingTop: unit / 2,
      paddingBottom: unit / 2,
    },
  };
};

interface IProps {
  classes?: any;
}

interface IState {
  guideAnchorElement?: HTMLElement;
}

export class GuideMenu extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      guideAnchorElement: null,
    };
  }

  public render(): any {
    const { classes } = this.props;
    const { guideAnchorElement } = this.state;
    const guideMenuOpen = Boolean(guideAnchorElement);

    return (
      <Fragment>
        <IconButton onClick={this.handleGuideMenuClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          classes={{ paper: classes.guideMenu }}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          id='guideMenu'
          anchorEl={guideAnchorElement}
          getContentAnchorEl={null}
          open={guideMenuOpen}
          onClick={this.handleGuideMenuClose}
        >
          <MenuItem
            classes={{ root: classes.guideMenuItem }}
            dense
            key='new-simulation'
            onClick={this.handleGuideMenuItemClick(0)}
          >
            New Simulation
          </MenuItem>
        </Menu>
      </Fragment>
    );
  }

  private handleGuideMenuClick = (event) => {
    this.setState({ guideAnchorElement: event.currentTarget });
  };

  private handleGuideMenuClose = () => {
    this.setState({ guideAnchorElement: null });
  };

  private handleGuideMenuItemClick = (index) => () => {
    debug('handleGuideMenuClick', { index });
    this.handleGuideMenuClose();
  };
}

export default withStyles(styles)(GuideMenu);

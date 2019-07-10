import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Info from '@material-ui/icons/Info';
import Popover from '@material-ui/core/Popover';

// import _debug from 'debug';
// const debug = _debug('lens:catalog:imageDetails');

interface IProps {
  classes?: any;
  children: any;
}

interface IState {
  anchor: any;
}

const styles: any = (theme) => {
  const { unit } = theme.spacing;
  return {
    root: {
      color: theme.palette.text.primary,
      display: 'flex',
    },
    iconButton: {
      width: unit * 4,
      height: unit * 4,
      padding: 0,
    },
  };
};

export class ImageDetailsCmp extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = { anchor: null };
  }

  public render(): any {
    const { classes, children } = this.props;
    const { anchor } = this.state;
    const isOpen = Boolean(anchor);

    return (
      <div className={classes.root}>
        <IconButton
          classes={{ root: classes.iconButton }}
          color='default'
          disableRipple
          onClick={this.handleClick}
        >
          <Info />
        </IconButton>
        <Popover
          open={isOpen}
          anchorEl={anchor}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {children}
        </Popover>
      </div>
    );
  }

  private handleClick = (e) => this.setState({ anchor: e.currentTarget });

  private handleClose = () => this.setState({ anchor: null });
}

export const ImageDetails = withStyles(styles)(ImageDetailsCmp);

import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles: any = {
  menuContainer: {
    width: '100%',
    display: 'flex',
  },
  menuItem: {
    padding: '2px 4px',
    margin: '0 4px',
    border: 'solid 1px #eee',
    borderRadius: 4,
    userSelect: 'none',
    '&:hover': {
      border: 'solid 1px #ccc',
    },
  },
  menuItemSelected: {
    borderColor: '#777',
  }
};

interface IProps {
  classes: any;
  initialChannel?: string;
  onChannelChanged?: (channel: string) => void;
}

interface IState {
  currentChannel: string;
  expanded: boolean;
}

class Menu extends React.Component<IProps, IState> {
  private preHoverChannel: string;

  constructor(props: IProps) {
    super(props);
    this.state = {
      expanded: false,
      currentChannel: props.initialChannel || 'r'
    };
  }

  public render(): any {
    const items = this.state.expanded ?
      this.renderExpanded() :
      this.renderCollapsed() ;

    return (
      <div
        className={this.props.classes.menuContainer}
        onMouseEnter={this.handleMouseEnterMenu}
        onMouseLeave={this.handleMouseLeaveMenu}
      >
        {items}
      </div>
    );
  }

  private renderExpanded(): any {
    const { currentChannel } = this.state;
    return ['r', 'g', 'b', 'h', 's', 'l'].map((item) => {
      const isSelected = item === currentChannel;
      const { classes } = this.props;
      const className = isSelected ? classes.menuItemSelected : classes.menuItem;
      return (
        <div
          key={item}
          className={className}
          onClick={this.handleItemClicked(item)}
          onMouseEnter={this.handleMouseEnterMenuItem(item)}
          onMouseLeave={this.handleMouseLeaveMenuItem(item)}
        >
          {item}
        </div>
      );
    });
  }

  private renderCollapsed(): any {
    const { currentChannel } = this.state;
    const { classes } = this.props;
    return <div key={currentChannel} className={classes.menuItemSelected}>{currentChannel}</div>;
  }

  private handleMouseEnterMenu = () => {
    this.setState({ expanded: true });
  };

  private handleMouseLeaveMenu = () => {
    this.setState({ expanded: false });
    const { onChannelChanged } = this.props;
    if (onChannelChanged && this.preHoverChannel) {
      onChannelChanged(this.preHoverChannel);
    }
  };

  private handleMouseEnterMenuItem = (channel) => () => {
    const { onChannelChanged } = this.props;
    if (onChannelChanged && channel) {
      this.preHoverChannel = this.state.currentChannel;
      onChannelChanged(channel);
    }
  };

  private handleMouseLeaveMenuItem = (ignore) => () => {
    // const { onChannelChanged } = this.props;
    // if (onChannelChanged) {
    //   onChannelChanged(this.preHoverChannel);
    // }
  };

  private handleItemClicked = (channel) => () => {
    if (channel && channel !== this.state.currentChannel) {
      this.preHoverChannel = channel;
      this.setState({ currentChannel: channel, expanded: false });
      const { onChannelChanged } = this.props;
      if (onChannelChanged) {
        onChannelChanged(channel);
      }
    }
  };
}

export default withStyles(styles)(Menu);

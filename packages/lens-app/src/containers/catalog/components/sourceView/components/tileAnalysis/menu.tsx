import * as React from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

interface IProps {
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
        className={styles.menuContainer}
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
      const classes = classNames(styles.menuItem, isSelected && styles.selected);
      return (
        <div
          key={item}
          className={classes}
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
    const classes = classNames(styles.menuItem, styles.selected);
    return <div key={currentChannel} className={classes}>{currentChannel}</div>;
  }

  private handleMouseEnterMenu = () => {
    this.setState({ expanded: true });
  };

  private handleMouseLeaveMenu = () => {
    this.setState({ expanded: false });
    const { onChannelChanged } = this.props;
    if (onChannelChanged) {
      onChannelChanged(this.preHoverChannel);
    }
  };

  private handleMouseEnterMenuItem = (channel) => () => {
    const { onChannelChanged } = this.props;
    if (onChannelChanged) {
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
    if (channel !== this.state.currentChannel) {
      this.preHoverChannel = channel;
      this.setState({ currentChannel: channel, expanded: false });
      const { onChannelChanged } = this.props;
      if (onChannelChanged) {
        onChannelChanged(channel);
      }
    }
  };
}

export default Menu;

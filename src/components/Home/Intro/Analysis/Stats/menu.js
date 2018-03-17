import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.preHoverChannel = null;

    this.state = {
      expanded: false,
      currentChannel: props.initialChannel || 'r'
    };
  }

  render() {
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

  renderExpanded() {
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

  renderCollapsed() {
    const { currentChannel } = this.state;
    const classes = classNames(styles.menuItem, styles.selected);
    return <div key={currentChannel} className={classes}>{currentChannel}</div>;
  }

  handleMouseEnterMenu = () => {
    this.setState({ expanded: true });
  };

  handleMouseLeaveMenu = () => {
    this.setState({ expanded: false });
    const { onChannelChanged } = this.props;
    if (onChannelChanged && this.preHoverChannel) {
      onChannelChanged(this.preHoverChannel);
    }
  };

  handleMouseEnterMenuItem = (channel) => () => {
    const { onChannelChanged } = this.props;
    if (onChannelChanged && channel) {
      this.preHoverChannel = this.state.currentChannel;
      onChannelChanged(channel);
    }
  };

  handleMouseLeaveMenuItem = (ignore) => () => {};

  handleItemClicked = (channel) => () => {
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

Menu.propTypes = {
  initialChannel: PropTypes.string,
  onChannelChanged: PropTypes.func
};

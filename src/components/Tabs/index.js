import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

export default class Tabs extends React.Component {
  static get propTypes() {
    return {
      selectedIndex: PropTypes.number,
      titles: PropTypes.arrayOf(PropTypes.string),
      onTabClicked: PropTypes.func
    };
  }

  static get defaultProps() {
    return {
      onTabClicked: () => {}
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      currentTabIndex: props.selectedIndex
    };
  }

  render() {
    const { titles, selectedIndex } = this.props;

    const tabs = titles.map((item, index) => {
      const tabClasses = classNames(styles.tab, index === selectedIndex && styles.selected);
      return (
        <div className={tabClasses} key={index} onClick={this.handleTabClicked(index)}>
          {item}
        </div>
      );
    });

    return (
      <div className={styles.container}>
        {tabs}
      </div>
    );
  }

  handleTabClicked = (index) => (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    this.props.onTabClicked(index);
  };
}

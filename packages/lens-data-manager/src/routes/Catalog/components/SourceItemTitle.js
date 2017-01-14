import React, { Component, PropTypes } from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import styles from './SourceItemTitle.scss';

class SourceItemTitle extends Component {
  static get propTypes() {
    return {
      name: PropTypes.string,
      expanded: PropTypes.bool,
      toggle: PropTypes.func,
      children: PropTypes.node
    };
  }

  static get defaultProps() {
    return {
      name: '',
      expanded: false,
      toggle: () => {}
    };
  }

  render() {
    const itemProps = {
      className: styles.container,
      onClick: event => {
        event.preventDefault();
        this.props.toggle();
      }
    };

    return (
      <div {...itemProps}>
        <div className={styles.icon}>
          <Glyphicon glyph={this.props.expanded ? 'minus-sign' : 'plus-sign'} />
        </div>
        <div className={styles.title}>
          {this.props.name}
        </div>
        <div className={styles.loading}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default SourceItemTitle;

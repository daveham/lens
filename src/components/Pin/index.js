import React from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';

import styles from './styles.scss';

export default class Pin extends React.Component {
  constructor(props) {
    super(props);
    this.controlledResize = throttle(this.updateSize, 50, { leading: true, trailing: true });

    this.state = {
      pin: {
        top: -500,
        left: 0
      }
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.controlledResize, false);
    setTimeout(this.pinContentAtAnchor, 0);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.controlledResize);
  }

  render() {
    const contentStyles = { ...this.state.pin };
    if (this.props.animate) {
      contentStyles.transition = 'top .5s ease-out';
    }

    return (
      <div className={styles.anchor} ref={(node) => this.anchorNode = node}>
        <div className={styles.content} style={contentStyles} ref={(node) => this.contentNode = node}>
          {this.props.children}
        </div>
      </div>
    );
  }

  pinContentAtAnchor = () => {
    const anchorRect = this.anchorNode.getBoundingClientRect();
    const contentRect = this.contentNode.getBoundingClientRect();
    const left =  anchorRect.left - contentRect.width;
    const top = anchorRect.top;
    this.setState({ pin: { top, left } });
  };

  updateSize = () => {
    if (this.anchorNode) {
      this.pinContentAtAnchor();
    }
  };
}

Pin.propTypes = {
  children: PropTypes.node,
  animate: PropTypes.bool
};

import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

export default class Pin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pin: {
        top: -500,
        left: 0
      }
    };
  }

  componentDidMount() {
    setTimeout(this.pinContentAtAnchor, 0);
  }

  render() {
    const contentStyles = { ...this.state.pin };

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
}

Pin.propTypes = {
  children: PropTypes.node
};

import React, { PropTypes } from 'react';
import styles from './Busy.scss';

const Busy = (props) => {
  if (props.busy) {
    return <span className={styles.busy}>{props.text}</span>;
  } else {
    return <span />;
  }
};

Busy.propTypes = {
  busy: PropTypes.bool,
  text: PropTypes.string
};

Busy.defaultProps = {
  busy: false,
  text: 'loading...'
};

export default Busy;

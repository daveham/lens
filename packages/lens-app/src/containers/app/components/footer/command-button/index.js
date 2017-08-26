import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './styles.scss';

const CommandButton = ({ title, connected, clickHandler }) => {
  const connectedButtonStyles = classNames(styles.button, !connected && styles.disabled);

  return (
    <button
      disabled={!connected}
      className={connectedButtonStyles}
      onClick={clickHandler}>{title}</button>
  );
};

CommandButton.propTypes = {
  connected: PropTypes.bool,
  clickHandler: PropTypes.func.isRequired
};

export default CommandButton;

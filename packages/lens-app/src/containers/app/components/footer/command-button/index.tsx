import classNames from 'classnames';
import React from 'react';

import styles from './styles.scss';

interface IProps {
  connected?: boolean;
  title: string;
  clickHandler: () => void;
}

const CommandButton = ({ title, connected, clickHandler }: IProps) => {
  const connectedButtonStyles = classNames(styles.button, !connected && styles.disabled);

  return (
    <button
      disabled={!connected}
      className={connectedButtonStyles}
      onClick={clickHandler}
    >
      {title}
    </button>
  );
};

export default CommandButton;

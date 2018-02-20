import classNames from 'classnames';
import React from 'react';

import styles from './styles.scss';

interface IProps {
  connected?: boolean;
  title?: string;
  clickHandler: () => void;
  children?: any;
}

const prevent = (e) => e.preventDefault();

const CommandButton = ({ title, children, connected, clickHandler }: IProps) => {
  const connectedButtonStyles = classNames(styles.button, !connected && styles.disabled);

  return (
    <button
      disabled={!connected}
      className={connectedButtonStyles}
      onClick={clickHandler}
      onMouseDown={prevent}
    >
      {title}
      {children}
    </button>
  );
};

export default CommandButton;

import classNames from 'classnames';
import React from 'react';

import styles from './styles.scss';

interface IProps {
  title: string;
  disabled?: boolean;
  clickHandler: () => void;
}

const ToolButton = ({ title, disabled, clickHandler }: IProps) => {
  const connectedButtonStyles = classNames(styles.button, disabled && styles.disabled);

  return (
    <button
      disabled={disabled}
      className={connectedButtonStyles}
      onClick={clickHandler}
    >
      {title}
    </button>
  );
};

export default ToolButton;

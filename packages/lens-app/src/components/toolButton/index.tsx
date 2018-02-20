import classNames from 'classnames';
import React from 'react';

import styles from './styles.scss';

interface IProps {
  title?: string;
  disabled?: boolean;
  clickHandler: () => void;
  children?: any;
}

const prevent = (e) => e.preventDefault();

const ToolButton = ({ title, children, disabled, clickHandler }: IProps) => {
  const buttonStyles = classNames(styles.button, disabled && styles.disabled);

  return (
    <button
      disabled={disabled}
      className={buttonStyles}
      onClick={clickHandler}
      onMouseDown={prevent}
    >
      {title}
      {children}
    </button>
  );
};

export default ToolButton;

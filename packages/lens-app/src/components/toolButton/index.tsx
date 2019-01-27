import classNames from 'classnames';
import React from 'react';

import styles from './styles.scss';

interface IToolButtonProps {
  title?: string;
  disabled?: boolean;
  clickHandler: () => void;
  children?: any;
}

const prevent = (e) => e.preventDefault();

export const ToolButton = ({ title, children, disabled, clickHandler }: IToolButtonProps) => {
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

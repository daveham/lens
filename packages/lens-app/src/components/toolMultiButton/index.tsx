import * as React from 'react';
import classNames from 'classnames';

import styles from './styles.scss';

interface IProps {
  selectedIndex?: number;
  titles?: string[];
  disabled?: boolean;
  clickHandler: (index: number) => void;
  children?: any;
}

const prevent = (e) => e.preventDefault();

class ToolMultiButton extends React.Component<IProps, any> {
  public render(): any {
    const { titles, children, disabled, selectedIndex = -1 } = this.props;
    let count = 0;
    if (titles) {
      count = titles.length;
    }
    if (children) {
      count = children.length;
    }

    const buttons: Array<any> = [];
    for (let i = 0; i < count; i++) {
      const buttonStyles = classNames(styles.button,
        disabled && styles.disabled,
        i === selectedIndex && styles.selected);

      buttons.push(
        <button
          key={i}
          disabled={disabled}
          className={buttonStyles}
          onClick={this.handleClick(i)}
          onMouseDown={prevent}
        >
          {titles && titles[i]}
          {children && children[i]}
        </button>
      );
    }

    return (
      <div className={styles.container}>
        {buttons}
      </div>
    );
  }

  private handleClick = (index) => (ev) => {
    ev.preventDefault();
    if (this.props.clickHandler) {
      this.props.clickHandler(index);
    }
  };
}

export default ToolMultiButton;

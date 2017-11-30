import * as React from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

interface IProps {
  children?: any;
  hideScrollbars?: boolean;
}

export default (props: IProps) => {
  const style = classNames(styles.scroller, props.hideScrollbars && styles.hideScrollbars);
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={style}>
          {props.children}
        </div>
      </div>
    </div>
  );
};

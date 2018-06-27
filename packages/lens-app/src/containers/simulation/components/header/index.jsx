import React from 'react';
import styles from './styles.scss';

export default (props) => (
  <div className={styles.container}>
    <div className={styles.title}>{props.title}</div>
    {!props.loading && props.children}
  </div>
);

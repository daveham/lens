import React from 'react';
import styles from './styles.scss';

export default (props) => {
  const title = props.loading ? `${props.title} (loading...)` : props.title;
  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      {props.children}
    </div>
  );
};


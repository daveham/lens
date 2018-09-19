import React from 'react';
import styles from './styles.scss';

export default (props) => {
  const title = props.loading ? `${props.title} (loading...)` : props.title;
  const bcElement = props.breadcrumb ? props.breadcrumb : null;
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        {bcElement}
        <div className={styles.title}>{title}</div>
      </div>
      {props.children}
    </div>
  );
};


import * as React from 'react';
import styles from './styles.scss';

interface IProps {
  id: number;
  name: string;
}

export default ({ id, name }: IProps) => {
  return (
    <div className={styles.container}>
      <div>{id}</div>
      <div>{name}</div>
    </div>
  );
};

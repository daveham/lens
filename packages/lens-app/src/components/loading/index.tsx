import * as React from 'react';
import faStyles from 'font-awesome/scss/font-awesome.scss';
import FontAwesome from 'react-fontawesome';
import styles from './styles.scss';

interface ILoadingProps {
  pulse?: boolean;
  name?: string;
}

export const Loading = ({ name, pulse }: ILoadingProps) => {
  const iconProps = {
    name: name || 'spinner',
    pulse: Boolean(pulse)
  };
  return (
    <div className={styles.container}>
      <FontAwesome cssModule={faStyles} {...iconProps} />
    </div>
  );
};

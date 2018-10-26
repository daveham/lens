import React from 'react';
import styles from './styles.scss';
import Typography from '@material-ui/core/Typography';

export default () => {
  return (
    <div className={styles.container}>
      <div className={styles.data}>
        <Typography variant='h4' gutterBottom noWrap>
          Home
        </Typography>
        <Typography variant='body1'>
          The Inference Lens - description.
        </Typography>
      </div>
    </div>
  );
};

import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import Pin from '../../../Pin';
import styles from '../styles.scss';

export default () => {
  return (
    <div>
      <Pin>
        <FontAwesomeIcon className={styles.icon} icon='wrench' size='4x'/>
      </Pin>
      <p>
        The operations.
      </p>
    </div>
  );
};

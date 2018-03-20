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
        The source code for Lens is managed as a monorepo and contains <a className={styles.external}
        href='https://github.com/daveham/lens/tree/master/packages'>multiple packages</a>, one for each
        project library.
      </p>
      <ul className={styles.techList}>
        <li>
          <span className={styles.tech}>
            <a href='https://lernajs.io/'>Lerna</a> &mdash; a tool for managing multiple packages in a single git repository
          </span>
        </li>
      </ul>
    </div>
  );
};

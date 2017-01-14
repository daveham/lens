import React from 'react';
import Well from 'react-bootstrap/lib/Well';

import styles from './AboutView.scss';

export const AboutView = () => {
  return (
    <div className={styles.container}>
      <Well className={styles.message}>
        This is the graphics management interface for the
        InferenceLens generative art software system.
      </Well>
    </div>
  );
};

export default AboutView;

import React from 'react';
import Socket from 'components/Service';

import styles from './Footer.scss';

export const Footer = () => {
  return (
    <div className={styles.container}>
      <Socket/>
    </div>
  );
};

export default Footer;

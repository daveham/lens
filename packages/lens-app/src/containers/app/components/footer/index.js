import React from 'react';
import PropTypes from 'prop-types';
import CommandButton from './command-button';

import styles from './styles.scss';

const Footer = ({ connected, pingFlash, pingJob }) => {

  return (
    <div className={styles.container}>
      <div>
        <CommandButton
          title={'ping(f)'}
          connected={true}
          clickHandler={pingFlash}/>
      </div>
      <div>
        <CommandButton
          title={'ping(j)'}
          connected={connected}
          clickHandler={pingJob}/>
      </div>
    </div>
  );
};

Footer.propTypes = {
  connected: PropTypes.bool,
  pingFlash: PropTypes.func.isRequired,
  pingJob: PropTypes.func.isRequired
};

export default Footer;

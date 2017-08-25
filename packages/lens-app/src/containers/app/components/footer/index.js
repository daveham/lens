import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

const Footer = ({ pingFlash, pingJob }) => {
  return (
    <div className={styles.container}>
      <div>
        <button
          className={styles.button}
          onClick={pingFlash}>ping(f)</button>
      </div>
      <div>
        <button
          className={styles.button}
          onClick={pingJob}>ping(j)</button>
      </div>
    </div>
  );
};

Footer.propTypes = {
  pingFlash: PropTypes.func.isRequired,
  pingJob: PropTypes.func.isRequired
};

export default Footer;

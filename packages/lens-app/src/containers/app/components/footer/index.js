import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

const Footer = ({ ping }) => {
  return (
    <div className={styles.container}>
      <div>
        <button
          className={styles.button}
          onClick={ping}>ping</button>
      </div>
    </div>
  );
};

Footer.propTypes = {
  ping: PropTypes.func.isRequired
};

export default Footer;

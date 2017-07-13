import React from 'react';
import PropTypes from 'prop-types';
import Footer from 'components/Footer';
import 'styles/core.scss';
import styles from './styles.scss';

export const CoreLayout = ({ children }) => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.viewContainer}>
        {children}
      </div>
      <Footer />
    </div>
  );
};

CoreLayout.propTypes = {
  children: PropTypes.element
};

export default CoreLayout;

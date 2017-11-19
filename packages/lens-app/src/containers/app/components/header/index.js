import React from 'react';
import logo from '../logo.svg';
import styles from './styles.scss';

const renderTitle = () => {
  return (
    <div className={styles.title}>
      <div>
        <h2>The Inference Lens</h2>
      </div>
      <div className={styles.logoContainer}>
        <img src={logo} className={styles.appLogo} alt='logo'/>
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <div className={styles.container}>
      {renderTitle()}
    </div>
  );
};

export default Header;

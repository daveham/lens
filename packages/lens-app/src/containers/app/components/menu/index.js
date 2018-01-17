import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.scss';

// <Link to='/FeatureA'>Feature A</Link>
// <Link to='/FeatureB'>Feature B</Link>

export default () => {
  return (
    <div className={styles.container}>
      <nav className={styles.menu}>
        <Link to='/'>Home</Link>
        <Link to='/Catalog'>Catalog</Link>
      </nav>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.scss';

export default () => {
  return (
    <div className={styles.container}>
      <nav className={styles.menu}>
        <Link to='/'>Home</Link>
        <Link to='/Catalog'>Catalog</Link>
        <Link to='/Simulation'>Simulation</Link>
        <Link to='/Render'>Render</Link>
      </nav>
    </div>
  );
};

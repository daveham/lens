import React from 'react';
import PropTypes from 'prop-types';
import logo from '../logo.svg';
import styles from './styles.scss';

const renderTitle = () => {
  return (
    <div className={styles.title}>
      <div>
        <img src={logo} className={styles.appLogo} alt='logo'/>
      </div>
      <div>
        <h2>Welcome to My App</h2>
      </div>
    </div>
  );
};

const renderTestOne = (one) => {
  return (
    one &&
    <span>One: [{one}] </span>
  );
};

const renderTestTwo = (two) => {
  return (
    two &&
    <span>Two: [{two}] </span>
  );
};

const renderDetails = (one, two) => {
  return (
    <div className={styles.details}>
      {renderTestOne(one)}
      {renderTestTwo(two)}
    </div>
  );
};

const Header = ({one, two}) => {
  return (
    <div className={styles.container}>
      {renderTitle()}
      {renderDetails(one, two)}
    </div>
  );
};

Header.propTypes = {
  one: PropTypes.string,
  two: PropTypes.string
};

export default Header;

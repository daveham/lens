import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

const propTypes = {
  location: PropTypes.object.isRequired
};

export default function PageNotFound({ location }) {
  return (
    <p className={styles.normal}>
      Page not found - the path, <code>{location.pathname}</code>,
      did not match any React Router routes.
    </p>
  );
}

PageNotFound.propTypes = propTypes;

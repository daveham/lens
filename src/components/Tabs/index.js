import React from 'react';
import * as ReactRouterDom from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './styles.scss';

export default function Tabs({ titles, paths }) {
  const tabs = titles.map((item, index) => {
    return (
      <ReactRouterDom.NavLink key={index} activeClassName={styles.activenavlink} to={paths[index]}>
        {item}
      </ReactRouterDom.NavLink>
    );
  });

  return  (
    <div className={styles.container}>
      {tabs}
    </div>
  );
}

Tabs.propTypes = {
  titles: PropTypes.arrayOf(PropTypes.string),
  paths: PropTypes.arrayOf(PropTypes.string)
};

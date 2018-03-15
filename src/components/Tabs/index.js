import React from 'react';
import * as ReactRouterDom from 'react-router-dom';
import PropTypes from 'prop-types';
import className from 'classnames';
import styles from './styles.scss';

export default function Tabs({ titles, paths, horizontal }) {
  const tabs = titles.map((item, index) => {
    return (
      <ReactRouterDom.NavLink key={index} activeClassName={styles.activenavlink} to={paths[index]}>
        {item}
      </ReactRouterDom.NavLink>
    );
  });

  const classes = className(styles.container, horizontal ? styles.horizontal : styles.vertical);

  return  (
    <div className={classes}>
      {tabs}
    </div>
  );
}

Tabs.propTypes = {
  titles: PropTypes.arrayOf(PropTypes.string),
  paths: PropTypes.arrayOf(PropTypes.string),
  horizontal: PropTypes.bool
};

Tabs.defaultProps = {
  horizontal: true
};

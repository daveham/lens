import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './Tile.scss';

const Tile = (props) => {
  const { width, height, id, onMove } = props;

  const sizeStyles = {
    width: width + 2,
    height: height + 2
  };

  const tileClasses = classnames(styles.container, onMove && styles.link);

  const optional = {};
  if (onMove) optional.onClick = () => { onMove(); };

  return (
    <div className={tileClasses} style={sizeStyles} {...optional}>
      {id}
    </div>
  );
};

Tile.propTypes = {
  id: PropTypes.string,
  onMove: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number
};

export default Tile;

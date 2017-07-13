import React from 'react';
import PropTypes from 'prop-types';
import Tile from './Tile';

import styles from './Navigator.scss';

const Navigator = (props) => {
  const { id, moveFuncs } = props;
  const { width, height, currentWidth, currentHeight, lastWidth, lastHeight } = props.spec;

  return (
    <div className={styles.navigator}>
      <div className={styles.navNorth}>
        <Tile
          onMove={moveFuncs[0]}
          id={'N'}
          width={currentWidth}
          height={height}
        />
      </div>
      <div className={styles.navMiddle}>
        <div className={styles.navEast}>
          <Tile
            onMove={moveFuncs[3]}
            id={'W'}
            width={width}
            height={currentHeight}
          />
        </div>
        <div className={styles.navTarget}>
          <Tile
            id={id}
            width={currentWidth}
            height={currentHeight}
          />
        </div>
        <div className={styles.navWest}>
          <Tile
            onMove={moveFuncs[1]}
            id={'E'}
            width={lastWidth}
            height={currentHeight}
          />
        </div>
      </div>
      <div className={styles.navSouth}>
        <Tile
          onMove={moveFuncs[2]}
          id={'S'}
          width={currentWidth}
          height={lastHeight}
        />
      </div>
    </div>
  );
};

Navigator.propTypes = {
  id: PropTypes.string.isRequired,
  spec: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    currentWidth: PropTypes.number.isRequired,
    currentHeight: PropTypes.number.isRequired,
    lastWidth: PropTypes.number.isRequired,
    lastHeight: PropTypes.number.isRequired
  }).isRequired,
  moveFuncs: PropTypes.arrayOf(PropTypes.func).isRequired
};

export default Navigator;

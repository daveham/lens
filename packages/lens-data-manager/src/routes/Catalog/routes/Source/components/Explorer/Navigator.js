import React, { PropTypes } from 'react';
import Tile from './Tile';

import styles from './Navigator.scss';

const Navigator = (props) => {
  const {width, height, moveFuncs} = props;

  return (
    <div className={styles.navigator}>
      <div className={styles.navNorth}>
        <Tile
          onMove={moveFuncs[0]}
          id={'N'}
          width={props.currentWidth}
          height={height}
        />
      </div>
      <div className={styles.navMiddle}>
        <div className={styles.navEast}>
          <Tile
            onMove={moveFuncs[3]}
            id={'W'}
            width={width}
            height={props.currentHeight}
          />
        </div>
        <div className={styles.navTarget}>
          <Tile
            id={props.id}
            width={props.currentWidth}
            height={props.currentHeight}
          />
        </div>
        <div className={styles.navWest}>
          <Tile
            onMove={moveFuncs[1]}
            id={'E'}
            width={props.lastWidth}
            height={props.currentHeight}
          />
        </div>
      </div>
      <div className={styles.navSouth}>
        <Tile
          onMove={moveFuncs[2]}
          id={'S'}
          width={props.currentWidth}
          height={props.lastHeight}
        />
      </div>
    </div>
  );
};

Navigator.propTypes = {
  id: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  currentWidth: PropTypes.number.isRequired,
  currentHeight: PropTypes.number.isRequired,
  lastWidth: PropTypes.number.isRequired,
  lastHeight: PropTypes.number.isRequired,
  moveFuncs: PropTypes.arrayOf(PropTypes.func).isRequired
};

export default Navigator;

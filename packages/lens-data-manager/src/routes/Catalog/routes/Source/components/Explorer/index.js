import React, { PropTypes } from 'react';
import Tile from './Tile';

import styles from './styles.scss';

const renderNavContext = () => {
  return <div>nav context</div>;
};

const renderNav = (id, width, height, moveFuncs) => {
  return (
    <div className={styles.navigator}>
      <div className={styles.navNorth}>
        <Tile
          onMove={moveFuncs[0]}
          id={'N'}
          width={width}
          height={height}
        />
      </div>
      <div className={styles.navMiddle}>
        <div className={styles.navEast}>
          <Tile
            onMove={moveFuncs[3]}
            id={'W'}
            width={width}
            height={height}
          />
        </div>
        <div className={styles.navTarget}>
          <Tile
            id={id}
            width={width}
            height={height}
          />
        </div>
        <div className={styles.navWest}>
          <Tile
            onMove={moveFuncs[1]}
            id={'E'}
            width={width}
            height={height}
          />
        </div>
      </div>
      <div className={styles.navSouth}>
        <Tile
          onMove={moveFuncs[2]}
          id={'S'}
          width={width}
          height={height}
        />
      </div>
    </div>
  );
};

const renderNavCaption = () => {
  return <div>nav context</div>;
};

const renderNavSection = (width, height, row, column, moveFuncs) => {
  return (
    <div className={styles.navSection}>
      {renderNavContext()}
      {renderNav(`${row}.${column}`, width, height, moveFuncs)}
      {renderNavCaption()}
    </div>
  );
};

const renderLeftSection = () => {
  return <div className={styles.leftSection}>Left</div>;
};

const renderRightSection = () => {
  return <div className={styles.rightSection}>Right</div>;
};

const Explorer = (props) => {
  const { width, height, row, column, tileWidth, tileHeight, onMove } = props;

  let tilesWide = Math.floor(width / tileWidth);
  let tilesHigh = Math.floor(height / tileHeight);
  const lastWidth = width - tilesWide * tileWidth;
  const lastHeight = height - tilesHigh * tileHeight;
  if (lastWidth > 0) tilesWide += 1;
  if (lastHeight > 0) tilesHigh += 1;

  const moveFuncs = [];
  moveFuncs.push(row > 0 ? onMove.bind(null, row - 1, column) : undefined);
  moveFuncs.push(column < tilesWide ? onMove.bind(null, row, column + 1) : undefined);
  moveFuncs.push(row < tilesHigh ? onMove.bind(null, row + 1, column) : undefined);
  moveFuncs.push(column > 0 ? onMove.bind(null, row, column - 1) : undefined);

  if (!width || !height) {
    return <div className={styles.container} />;
  }

  return (
    <div className={styles.container}>
      {renderLeftSection()}
      {renderNavSection(tileWidth, tileHeight, row, column, moveFuncs)}
      {renderRightSection()}
    </div>
  );
};
/*
      <div className={styles.calcs}>
        Image width { width }, height { height }<br/>
        Tile width {tileWidth}, height {tileHeight}<br/>
        Tiles wide {tilesWide}, high {tilesHigh}<br/>
        Last wide {lastWidth}, high {lastHeight}
      </div>
*/
Explorer.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  row: PropTypes.number,
  column: PropTypes.number,
  tileWidth: PropTypes.number.isRequired,
  tileHeight: PropTypes.number.isRequired,
  onMove: PropTypes.func.isRequired
};

export default Explorer;

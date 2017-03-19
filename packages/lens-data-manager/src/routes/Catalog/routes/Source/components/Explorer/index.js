import React, { PropTypes } from 'react';
import Navigator from './Navigator';

import styles from './styles.scss';

const renderNavContext = (width, height, tilesWide, tilesHigh, tileWidth, tileHeight, lastWidth, lastHeight) => {
  return (
    <div className={styles.context}>
      Image { width } wide, { height } high<br/>
      Tile {tileWidth} wide, {tileHeight} high<br/>
      Tiles {tilesWide} wide, {tilesHigh} high<br/>
      Last width {lastWidth}, height {lastHeight}
    </div>
  );
};

const renderNavCaption = (row, column) => {
  return <div className={styles.caption}>{`row ${row} column ${column}`}</div>;
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
  let lastWidth = width - tilesWide * tileWidth;
  let lastHeight = height - tilesHigh * tileHeight;
  if (lastWidth > 0) {
    tilesWide += 1;
  } else {
    lastWidth = tileWidth;
  }
  if (lastHeight > 0) {
    tilesHigh += 1;
  } else {
    lastHeight = tileHeight;
  }

  const isLastRow = row === tilesHigh - 1;
  const isLastCol = column === tilesWide - 1;
  const isNextToLastRow = row === tilesHigh - 2;
  const isNextToLastCol = column === tilesWide - 2;

  const moveFuncs = [];
  moveFuncs.push(row > 0 ? onMove.bind(null, row - 1, column) : undefined);
  moveFuncs.push(isLastCol ? undefined : onMove.bind(null, row, column + 1));
  moveFuncs.push(isLastRow ? undefined : onMove.bind(null, row + 1, column));
  moveFuncs.push(column > 0 ? onMove.bind(null, row, column - 1) : undefined);

  if (!width || !height) {
    return <div className={styles.container} />;
  }

  return (
    <div className={styles.container}>
      {renderLeftSection()}
      <div className={styles.navSection}>
        {renderNavContext(width, height, tilesWide, tilesHigh, tileWidth, tileHeight, lastWidth, lastHeight)}
        <Navigator
          id={`${row}.${column}`}
          width={tileWidth}
          height={tileHeight}
          currentWidth={isLastCol ? lastWidth : tileWidth}
          currentHeight={isLastRow ? lastHeight : tileHeight}
          lastWidth={isNextToLastCol ? lastWidth : tileWidth}
          lastHeight={isNextToLastRow ? lastHeight : tileHeight}
          moveFuncs={moveFuncs}
        />
        {renderNavCaption(row, column)}
      </div>
      {renderRightSection()}
    </div>
  );
};

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

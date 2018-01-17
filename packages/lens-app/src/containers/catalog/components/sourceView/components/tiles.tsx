import * as React from 'react';
import { throttle } from 'lodash';
import { makeTileImageKeyFromPrototype } from '@lens/image-descriptors';
import { IStatsSpec } from '../../../utils';
import styles from './styles.scss';
import MovablePanel from '../../../../../components/movablePanel';
import Tile from './tile';
import TileAnalysis from './tileAnalysis';

import _debug from 'debug';
const debug = _debug('lens:source-tiles');

interface IProps {
  statsSpec: IStatsSpec;
  imageKeys: ReadonlyArray<string>;
  images: {[id: string]: any};
  stats: {[id: string]: any};
  selectedStatsKey?: string;
  onSizeChanged?: (left: number, top: number, width: number, height: number) => void;
  onTileSelectionChanged?: (key: string, top: number, left: number) => void;
}

interface ISelectedTile {
  row: number;
  col: number;
  imageKey: string;
}

interface IViewport {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface IState {
  width: number;
  height: number;
  selectedTile: ISelectedTile;
  selectedStatsData: any;
  tileViewport: IViewport;
}

const keyMoves = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0]
};

function generateImageKey(props: IProps, x: number = 0, y: number = 0) {
  return props.imageKeys.length ?
    makeTileImageKeyFromPrototype(props.imageKeys[0], x, y) : '';
}

class Tiles extends React.Component<IProps, IState> {
  private containerNode: any;
  private controlledResize: () => void;

  constructor(props: IProps) {
    super(props);

    let selectedStatsData = {};
    debug('constructor', { selectedStatsKey: props.selectedStatsKey });
    if (props.selectedStatsKey) {
      selectedStatsData = props.stats[props.selectedStatsKey] || {};
    }

    this.state = {
      width: 0,
      height: 0,
      selectedTile: {
        row: 0,
        col: 0,
        imageKey: generateImageKey(props)
      },
      selectedStatsData,
      tileViewport: { top: 0, right: 0, bottom: 0, left: 0 }
    };

    this.controlledResize = throttle(this.updateSize, 50, { leading: true, trailing: true });
  }

  public componentDidMount(): any {
    document.addEventListener('keydown', this.handleKeyDown, false);
    window.addEventListener('resize', this.controlledResize, false);
    this.updateSize();
  }

  public componentWillUnmount(): any {
    document.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('resize', this.controlledResize);
  }

  public componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.imageKeys !== this.props.imageKeys) {
      const { selectedTile } = this.state;
      if (!selectedTile.imageKey.length) {
        const { res } = nextProps.statsSpec;
        const { row, col } = selectedTile;
        this.setState({ selectedTile: {
          row,
          col,
          imageKey: generateImageKey(nextProps, col * res, row * res)
        }});
      }
    }
    debug('componentWillReceiveProps', {
      nextSelectedStatsKey: nextProps.selectedStatsKey,
      curSelectedStatsKey: this.props.selectedStatsKey });
    if ((nextProps.selectedStatsKey !== this.props.selectedStatsKey) ||
      (nextProps.selectedStatsKey &&
        (nextProps.stats[nextProps.selectedStatsKey] !== this.props.stats[nextProps.selectedStatsKey]))) {
      debug('setState', { selectedStatsData: nextProps.stats[nextProps.selectedStatsKey] });
      this.setState({ selectedStatsData: nextProps.stats[nextProps.selectedStatsKey] || {} });
    }
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    const { width, height, tileViewport: { left, top } } = this.state;
    if (prevState.width !== width ||
      prevState.height !== height ||
      prevState.tileViewport.left !== left ||
      prevState.tileViewport.top !== top) {
      // size has changed
      if (this.props.onSizeChanged) {
        const { res } = this.props.statsSpec;
        this.props.onSizeChanged(left * res, top * res, width, height);
      }
    }

    if (this.state.selectedTile.imageKey !== prevState.selectedTile.imageKey) {
      if (this.props.onTileSelectionChanged) {
        const { selectedTile: { col, row } } = this.state;
        const tileDimensions = this.calculateTileDimensions(col + left, row + top);
        this.props.onTileSelectionChanged(this.state.selectedTile.imageKey, tileDimensions.top, tileDimensions.left);
      }
    }
  }

  public render() {
    const { width, height, tileViewport } = this.state;
    const { imageKeys, images, statsSpec } = this.props;
    const { res } = statsSpec;

    const limitLeft = tileViewport.left * res;
    const limitTop = tileViewport.top * res;

    const tiles = [];
    imageKeys.forEach((key) => {
      const image = images[key];
      if (image) {
        const left = image.x - limitLeft;
        const top = image.y - limitTop;
        if (left >= 0 && top >= 0 &&
          left <= width && top <= height) {
          tiles.push(
            <Tile
              key={key}
              left={left}
              top={top}
              width={res}
              height={res}
              url={image.url}
              loading={image.loading}
            />
          );
        }
      }
    });

    return (
      <div
        className={styles.tilesContainer}
        ref={(node) => this.containerNode = node}
      >
        {tiles}
        {this.renderActiveElements()}
      </div>
    );
  }

  private renderActiveElements() {
    if (this.state.width || this.state.height) {
      return [
        this.renderSelection(),
        this.renderInfo()
      ];
    }
    return null;
  }

  private renderInfo() {
    const { res } = this.props.statsSpec;
    const { selectedTile, tileViewport, selectedStatsData } = this.state;

    const selectedRow = selectedTile.row + tileViewport.top;
    const selectedCol = selectedTile.col + tileViewport.left;

    return (
      <MovablePanel
        key='info'
        initialLeft={200}
        initialTop={50}
        constrainRect={this.containerNode.getBoundingClientRect()}
      >
        <TileAnalysis
          row={selectedRow}
          col={selectedCol}
          offsetX={selectedCol * res}
          offsetY={selectedRow * res}
          stats={selectedStatsData}
        />
      </MovablePanel>
    );
  }

  private calculateTileDimensions(col: number, row: number): any {
    const { res, tilesWide, tilesHigh, lastHeight, lastWidth } = this.props.statsSpec;

    return {
      left: col * res,
      top: row * res,
      width: col === tilesWide - 1 ? lastWidth : res,
      height: row === tilesHigh - 1 ? lastHeight : res
    };
  }

  private renderSelection() {
    const { res } = this.props.statsSpec;
    const { selectedTile: { col, row }, tileViewport: { left, top } } = this.state;
    const tileDimensions = this.calculateTileDimensions(col + left, row + top);

    const inset = 1;
    const style = {
      top: row * res + inset,
      left: col * res + inset,
      width: tileDimensions.width - 2 * inset,
      height: tileDimensions.height - 2 * inset
    };

    return <div key='selection' className={styles.selection} style={style}/>;
  }

  private updateSize = () => {
    if (this.containerNode) {
      const { width, height, tileViewport } = this.state;
      const { offsetWidth, offsetHeight } = this.containerNode;
      if (width !== offsetWidth || height !== offsetHeight) {
        // size has changed, calculate a new viewport
        const { res } = this.props.statsSpec;
        const newTileViewPort = {
          top: tileViewport.top,
          left: tileViewport.left,
          right: Math.floor(offsetWidth / res),
          bottom: Math.floor(offsetHeight / res)
        };
        const newState: any = {
          width: offsetWidth,
          height: offsetHeight,
          tileViewport: newTileViewPort
        };
        // ensure selected tile is within bounds of the new viewport
        const { row, col } = this.state.selectedTile;
        const adjustedCol = Math.min(newTileViewPort.right, Math.max(newTileViewPort.left, col));
        const adjustedRow = Math.min(newTileViewPort.bottom, Math.max(newTileViewPort.top, row));
        if (row !== adjustedRow || col !== adjustedCol) {
          newState.selectedTile = {
            col: adjustedCol,
            row: adjustedRow,
            imageKey: generateImageKey(this.props, adjustedCol * res, adjustedRow * res)
          };
        }
        this.setState(newState);
      }
    }
  };

  private handleKeyDown = (event) => {
    const move = keyMoves[event.code];
    if (move) {
      this.moveSelection(move[0], move[1]);
      event.stopPropagation();
      event.preventDefault();
    }
  };

  private moveSelection(deltaX, deltaY) {
    const { selectedTile: { row, col }, tileViewport } = this.state;
    const { statsSpec: { tilesWide, tilesHigh, res } } = this.props;
    const newRow = row + deltaY;
    const newCol = col + deltaX;
    const tileRow = newRow + tileViewport.top;
    const tileCol = newCol + tileViewport.left;
    if (tileRow >= tileViewport.top && tileCol >= tileViewport.left &&
      tileRow < tileViewport.bottom && tileCol < tileViewport.right) {
      // movement is within current viewport
      this.setState({
        selectedTile: {
          row: newRow,
          col: newCol,
          imageKey: generateImageKey(this.props, newCol * res, newRow * res)
        }
      });
    } else {
      // movement calls for shifting the viewport to contain the selection
      let moveX = 0;
      let moveY = 0;
      if (deltaX !== 0) {
        if (tileCol >= tileViewport.right && tileCol < tilesWide) {
          moveX = 1;
        } else if (tileCol < tileViewport.left && tileCol >= 0) {
          moveX = -1;
        }
      }
      if (deltaY !== 0) {
        if (tileRow >= tileViewport.bottom && tileRow < tilesHigh) {
          moveY = 1;
        } else if (tileRow < tileViewport.top && tileRow >= 0) {
          moveY = -1;
        }
      }
      if (moveX !== 0 || moveY !== 0) {
        this.setState({
          tileViewport: {
            top: tileViewport.top + moveY,
            bottom: tileViewport.bottom + moveY,
            left: tileViewport.left + moveX,
            right: tileViewport.right + moveX
          },
          selectedTile: {
            row,
            col,
            imageKey: generateImageKey(this.props, (col + moveX) * res, (row + moveY) * res)
          }
        });
      }
    }
  }
}

export default Tiles;

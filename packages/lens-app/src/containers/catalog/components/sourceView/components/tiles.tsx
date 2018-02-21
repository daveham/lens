import * as React from 'react';
import { throttle } from 'lodash';
import { makeTileImageKeyFromPrototype } from '@lens/image-descriptors';
import { ITileSpec } from '../../../utils';
import styles from './styles.scss';
import MovablePanel from '../../../../../components/movablePanel';
import Tile from './tile';
import TileAnalysis from './tileAnalysis';

// import _debug from 'debug';
// const debug = _debug('lens:source-tiles');

interface IProps {
  statsTileSpec: ITileSpec;
  displayTileSpec: ITileSpec;
  imageKeys: ReadonlyArray<string>;
  images: {[id: string]: any};
  stats: {[id: string]: any};
  selectedStatsKey?: string;
  onSizeChanged?: (left: number, top: number, width: number, height: number) => void;
  onTileSelectionChanged?: (key: string, top: number, left: number) => void;
}

interface ISelectedTile {
  x: number;
  y: number;
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
  viewport: IViewport;
  selectedTile: ISelectedTile;
  selectedStatsData: any;
}

const keyMoves = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0]
};

function generateImageKey(props: IProps, group: number = 0, x: number = 0, y: number = 0) {
  if (props.imageKeys.length) {
    group = group || props.statsTileSpec.res;
    return makeTileImageKeyFromPrototype(props.imageKeys[0], group, x, y);
  }
  return '';
}

const initialViewport: IViewport = {
  top: 0, right: 0, bottom: 0, left: 0
};

class Tiles extends React.Component<IProps, IState> {
  private containerNode: any;
  private controlledResize: () => void;

  constructor(props: IProps) {
    super(props);

    let selectedStatsData = {};
    if (props.selectedStatsKey) {
      selectedStatsData = props.stats[props.selectedStatsKey] || {};
    }

    this.state = {
      width: 0,
      height: 0,
      selectedTile: {
        x: 0,
        y: 0,
        imageKey: generateImageKey(props)
      },
      selectedStatsData,
      viewport: initialViewport
    };

    this.controlledResize = throttle(this.updateSize, 50, { leading: true, trailing: true });
  }

  public componentDidMount(): any {
    document.addEventListener('keydown', this.handleKeyDown, false);
    window.addEventListener('resize', this.controlledResize, false);
    setTimeout(() => {
      this.updateSize();
    }, 300);
  }

  public componentWillUnmount(): any {
    document.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('resize', this.controlledResize);
  }

  public componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.stats !== this.props.stats ||
      nextProps.statsTileSpec !== this.props.statsTileSpec) {
      const { selectedTile } = this.state;
      if (nextProps.statsTileSpec !== this.props.statsTileSpec ||
        !selectedTile.imageKey.length) {
        const { res } = nextProps.statsTileSpec;
        const { x, y } = selectedTile;
        this.setState({ selectedTile: {
          x,
          y,
          imageKey: generateImageKey(nextProps, res, x, y)
        }});
      }
    }
    if ((nextProps.selectedStatsKey !== this.props.selectedStatsKey) ||
      (nextProps.selectedStatsKey &&
        (nextProps.stats[nextProps.selectedStatsKey] !== this.props.stats[nextProps.selectedStatsKey]))) {
      this.setState({ selectedStatsData: nextProps.stats[nextProps.selectedStatsKey] || {} });
    }
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    const { width, height, viewport: { left, top } } = this.state;
    if (prevState.width !== width ||
      prevState.height !== height ||
      prevState.viewport.left !== left ||
      prevState.viewport.top !== top) {
      // size has changed
      if (this.props.onSizeChanged) {
        this.props.onSizeChanged(left, top, width, height);
      }
    }

    if (this.state.selectedTile.imageKey !== prevState.selectedTile.imageKey) {
      if (this.props.onTileSelectionChanged) {
        const { selectedTile: { x, y } } = this.state;
        const tileDimensions = this.calculateSelectedTileDimensions(x, y);
        this.props.onTileSelectionChanged(this.state.selectedTile.imageKey, tileDimensions.top, tileDimensions.left);
      }
    }
  }

  public render() {
    const { viewport } = this.state;
    const { imageKeys, images, displayTileSpec } = this.props;
    const { res } = displayTileSpec;

    const tiles = [];
    imageKeys.forEach((key) => {
      const image = images[key];
      if (image) {
        const left = image.x - viewport.left;
        const top = image.y - viewport.top;
        if (left + res > 0 && top + res > 0 &&
          left < viewport.right && top < viewport.bottom) {
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
    if (this.containerNode && (this.state.width || this.state.height)) {
      return [
        this.renderSelection(),
        this.renderInfo()
      ];
    }
    return null;
  }

  private renderInfo() {
    const { res } = this.props.statsTileSpec;
    const { selectedTile: { x, y }, selectedStatsData } = this.state;

    return (
      <MovablePanel
        key='info'
        initialLeft={200}
        initialTop={50}
        constrainRect={this.containerNode.getBoundingClientRect()}
      >
        <TileAnalysis
          row={Math.floor(y / res)}
          col={Math.floor(x / res)}
          offsetX={x}
          offsetY={y}
          stats={selectedStatsData}
        />
      </MovablePanel>
    );
  }

  private calculateSelectedTileDimensions(x: number, y: number): any {
    const { res, tilesWide, tilesHigh, lastHeight, lastWidth } = this.props.statsTileSpec;

    const col = Math.floor(x / res);
    const row = Math.floor(y / res);

    return {
      left: x,
      top: y,
      width: col === tilesWide - 1 ? lastWidth : res,
      height: row === tilesHigh - 1 ? lastHeight : res
    };
  }

  private renderSelection() {
    const { selectedTile: { x, y }, viewport: { top, left } } = this.state;
    const tileDimensions = this.calculateSelectedTileDimensions(x, y);

    const inset = 1;
    const style = {
      top: y + inset - top,
      left: x + inset - left,
      width: tileDimensions.width - 2 * inset,
      height: tileDimensions.height - 2 * inset
    };

    return <div key='selection' className={styles.selection} style={style}/>;
  }

  private updateSize = () => {
    if (this.containerNode) {
      const { clientWidth, clientHeight } = this.containerNode;
      if (this.state.width !== clientWidth || this.state.height !== clientHeight) {
        // size has changed, calculate new viewports
        const { viewport } = this.state;
        const { res, width, tilesWide, height, tilesHigh } = this.props.statsTileSpec;
        const newViewport = {
          top: viewport.top,
          left: viewport.left,
          right: viewport.left + clientWidth,
          bottom: viewport.top + clientHeight
        };
        if (newViewport.right - width > res) {
          const shiftX = newViewport.right - tilesWide * res;
          newViewport.left -= shiftX;
          newViewport.right -= shiftX;
        }
        if (newViewport.bottom - height > res) {
          const shiftY = newViewport.bottom - tilesHigh * res;
          newViewport.top -= shiftY;
          newViewport.bottom -= shiftY;
        }

        const newState: any = {
          width: clientWidth,
          height: clientHeight,
          viewport: newViewport
        };

        // ensure selected tile is within bounds of the new viewport
        const { x, y } = this.state.selectedTile;
        const adjustedX = Math.min(newViewport.right, Math.max(newViewport.left, x));
        const adjustedY = Math.min(newViewport.bottom, Math.max(newViewport.top, y));
        if (x !== adjustedX || y !== adjustedY) {
          newState.selectedTile = {
            y: adjustedY,
            x: adjustedX,
            imageKey: generateImageKey(this.props, res, adjustedX, adjustedY)
          };
        }
        this.setState(newState);
      }
    }
  };

  private handleKeyDown = (event) => {
    const move = keyMoves[event.code];
    if (move) {
      let moveX = move[0];
      let moveY = move[1];
      if (event.shiftKey) {
        const { viewport } = this.state;
        const { res } = this.props.statsTileSpec;
        if (moveX) {
          moveX = moveX * Math.floor((viewport.right - viewport.left) / res);
        }
        if (moveY) {
          moveY = moveY * Math.floor((viewport.bottom - viewport.top) / res);
        }
      }
      this.moveSelection(moveX, moveY);
      event.stopPropagation();
      event.preventDefault();
    }
  };

  private moveSelection(deltaX, deltaY) {
    if (deltaX === 0 && deltaY === 0) {
      return;
    }

    const { selectedTile: { x, y }, viewport } = this.state;
    const { statsTileSpec: { res, width, height, lastWidth, lastHeight } } = this.props;
    let nextX = x;
    let nextY = y;

    if (deltaX !== 0) {
      nextX = x + deltaX * res;
      nextX = Math.min(Math.max(nextX, 0), width - lastWidth);
    }
    if (deltaY !== 0) {
      nextY = y + deltaY * res;
      nextY = Math.min(Math.max(nextY, 0), height - lastHeight);
    }

    if (x === nextX && y === nextY) {
      return;
    }

    const nextTile = this.calculateSelectedTileDimensions(nextX, nextY);
    let moveViewportByX = 0;
    if (deltaX !== 0) {
      if (nextTile.left + nextTile.width > viewport.right) {
        moveViewportByX = Math.min(nextTile.left + nextTile.width - viewport.right, width - viewport.right);
      } else if (nextTile.left < viewport.left) {
        moveViewportByX = -Math.min(viewport.left - nextTile.left , viewport.left);
      }
    }
    let moveViewportByY = 0;
    if (deltaY !== 0) {
      if (nextTile.top + nextTile.height > viewport.bottom) {
        moveViewportByY = Math.min(nextTile.top + nextTile.height - viewport.bottom, height - viewport.bottom);
      } else if (nextTile.top < viewport.top) {
        moveViewportByY = -Math.min(viewport.top - nextTile.top, viewport.top);
      }
    }

    const nextState: any = {
      selectedTile: {
        x: nextTile.left,
        y: nextTile.top,
        imageKey: generateImageKey(this.props, res, nextTile.left, nextTile.top)
      }
    };
    if (moveViewportByX || moveViewportByY) {
      nextState.viewport = {
        top: viewport.top + moveViewportByY,
        bottom: viewport.bottom + moveViewportByY,
        left: viewport.left + moveViewportByX,
        right: viewport.right + moveViewportByX
      };
    }
    this.setState(nextState);
  }
}

export default Tiles;

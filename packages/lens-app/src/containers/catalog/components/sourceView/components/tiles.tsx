import * as React from 'react';
import { throttle } from 'lodash';
import { IStatsSpec } from '../../../utils';
import styles from './styles.scss';
import Tile from './tile';

import _debug from 'debug';
const debug = _debug('lens:sourceView:tiles');

interface IProps {
  statsSpec: IStatsSpec;
  imageKeys: ReadonlyArray<string>;
  images: {[id: string]: any};
  onSizeChanged?: (left: number, top: number, width: number, height: number) => void;
}

interface ISelectedTile {
  row: number;
  col: number;
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
  tileViewport: IViewport;
}

const keyMoves = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0]
};

class Tiles extends React.Component<IProps, IState> {
  private containerNode: any;
  private controlledResize: () => void;

  constructor(props: IProps) {
    super(props);

    this.state = {
      width: 0,
      height: 0,
      selectedTile: { row: 0, col: 0 },
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

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    const { width, height, tileViewport } = this.state;
    if (prevState.width !== width ||
      prevState.height !== height ||
      prevState.tileViewport.left !== tileViewport.left ||
      prevState.tileViewport.top !== tileViewport.top) {
      debug('componentDidUpdate - size changed', { width, height, tileViewport });
      if (this.props.onSizeChanged) {
        const { res } = this.props.statsSpec;
        const left = tileViewport.left * res;
        const top = tileViewport.top * res;
        this.props.onSizeChanged(left, top, width, height);
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
        {this.renderSelection()}
      </div>
    );
  }

  private renderSelection() {
    const { res } = this.props.statsSpec;
    const { selectedTile } = this.state;

    const inset = 1;
    const top = selectedTile.row * res + inset;
    const left = selectedTile.col * res + inset;
    const side = res - 2 * inset;

    const style = {
      top,
      left,
      width: side,
      height: side
    };

    return <div key='selection' className={styles.selection} style={style}/>;
  }

  private updateSize = () => {
    if (this.containerNode) {
      const { width, height, tileViewport } = this.state;
      const { offsetWidth, offsetHeight } = this.containerNode;
      if (width !== offsetWidth || height !== offsetHeight) {
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
        const { row, col } = this.state.selectedTile;
        const adjustedCol = Math.min(newTileViewPort.right, Math.max(newTileViewPort.left, col));
        const adjustedRow = Math.min(newTileViewPort.bottom, Math.max(newTileViewPort.top, row));
        if (row !== adjustedRow || col !== adjustedCol) {
          newState.selectedTile = { col: adjustedCol, row: adjustedRow };
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
    const { selectedTile, tileViewport } = this.state;
    const { statsSpec } = this.props;
    const row = selectedTile.row + deltaY;
    const col = selectedTile.col + deltaX;
    const tileRow = row + tileViewport.top;
    const tileCol = col + tileViewport.left;
    if (tileRow >= tileViewport.top && tileCol >= tileViewport.left &&
      tileRow < tileViewport.bottom && tileCol < tileViewport.right) {
      this.setState({ selectedTile: { row, col } });
    } else {
      let moveX = 0;
      let moveY = 0;
      if (deltaX !== 0) {
        if (tileCol >= tileViewport.right && tileCol < statsSpec.tilesWide) {
          moveX = 1;
        } else if (tileCol < tileViewport.left && tileCol >= 0) {
          moveX = -1;
        }
      }
      if (deltaY !== 0) {
        if (tileRow >= tileViewport.bottom && tileRow < statsSpec.tilesHigh) {
          moveY = 1;
        } else if (tileRow < tileViewport.top && tileRow >= 0) {
          moveY = -1;
        }
      }
      if (moveX !== 0 || moveY !== 0) {
        this.setState({ tileViewport: {
            top: tileViewport.top + moveY,
            bottom: tileViewport.bottom + moveY,
            left: tileViewport.left + moveX,
            right: tileViewport.right + moveX
          } });
      }
    }
  }
}

export default Tiles;

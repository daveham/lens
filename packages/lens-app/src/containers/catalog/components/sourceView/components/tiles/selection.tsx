import * as React from 'react';
import { IViewport, ITileSpec, ISelectedTile } from '../../interfaces';
import { sizeFromViewport, calculateTileDimensions } from '../../utils';

import styles from './styles.scss';

interface IProps {
  statsTileSpec: ITileSpec;
  viewport: IViewport;
  selectedTile: ISelectedTile;
  onSelectionChanged: (top: number, left: number, viewport: IViewport) => void;
}

const keyMoves = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0]
};

class Selection extends React.Component<IProps, any> {
  public componentDidMount(): any {
    document.addEventListener('keydown', this.handleKeyDown, false);
  }

  public componentWillUnmount(): any {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  public render(): any {
    const { selectedTile: { x, y }, viewport: { top, left } } = this.props;
    const { width, height } = calculateTileDimensions(this.props.statsTileSpec, x, y);

    const inset = 1;
    const style = {
      top: y + inset - top,
      left: x + inset - left,
      width: width - 2 * inset,
      height: height - 2 * inset
    };

    return <div className={styles.selection} style={style}/>;
  }

  private handleKeyDown = (event) => {
    const move = keyMoves[event.code];
    if (move) {
      event.stopPropagation();
      event.preventDefault();

      let moveX = move[0];
      let moveY = move[1];
      if (event.shiftKey) {
        const { width, height } = sizeFromViewport(this.props.viewport);
        const { res } = this.props.statsTileSpec;
        if (moveX) {
          moveX = moveX * Math.floor(width / res);
        }
        if (moveY) {
          moveY = moveY * Math.floor(height / res);
        }
      }
      this.moveSelection(moveX, moveY);
    }
  };

  private moveSelection(deltaX, deltaY) {
    if (deltaX === 0 && deltaY === 0) {
      return;
    }

    const {
      statsTileSpec: { res, width, height, lastWidth, lastHeight },
      selectedTile: { x, y },
      viewport
    } = this.props;
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

    const nextTile = calculateTileDimensions(this.props.statsTileSpec, nextX, nextY);
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

    let nextViewport;
    if (moveViewportByX || moveViewportByY) {
      nextViewport = {
        top: viewport.top + moveViewportByY,
        bottom: viewport.bottom + moveViewportByY,
        left: viewport.left + moveViewportByX,
        right: viewport.right + moveViewportByX
      };
    }

    this.props.onSelectionChanged(nextTile.top, nextTile.left, nextViewport);
  }
}

export default Selection;

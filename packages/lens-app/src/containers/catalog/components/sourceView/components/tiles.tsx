import * as React from 'react';
import { throttle } from 'lodash';
import styles from './styles.scss';
import Tile from './tile';

import _debug from 'debug';
const debug = _debug('lens:sourceView:tiles');

interface IProps {
  resolution: number;
  imageKeys: ReadonlyArray<string>;
  images: {[id: string]: any};
  onSizeChanged?: (width: number, height: number) => void;
}

interface ISelectedTile {
  row: number;
  col: number;
}

interface IState {
  width: number;
  height: number;
  selectedTile: ISelectedTile;
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
      selectedTile: { row: 0, col: 0 }
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
    const { width, height } = this.state;
    if (prevState.width !== width ||
      prevState.height !== height) {
      debug('componentDidUpdate - size changed', { width, height });
      if (this.props.onSizeChanged) {
        this.props.onSizeChanged(width, height);
      }
    }
  }

  public render() {
    const { imageKeys, images, resolution } = this.props;
    const imageElements = imageKeys.map((key) => {
      const image = images[key];
      return image ? (
        <Tile
          key={key}
          left={image.x}
          top={image.y}
          width={resolution}
          height={resolution}
          url={image.url}
          loading={image.loading}
        />
      ) : null;
    });

    return (
      <div
        className={styles.tilesContainer}
        ref={(node) => this.containerNode = node}
      >
        {imageElements}
        {this.renderSelection()}
      </div>
    );
  }

  private renderSelection() {
    const { resolution } = this.props;
    const { selectedTile } = this.state;

    const inset = 2;
    const top = selectedTile.row * resolution + inset;
    const left = selectedTile.col * resolution + inset;
    const side = resolution - 2 * inset;

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
      const { width, height } = this.state;
      const { offsetWidth, offsetHeight } = this.containerNode;
      if (width !== offsetWidth || height !== offsetHeight) {
        this.setState({
          width: offsetWidth,
          height: offsetHeight
        });
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
    const { selectedTile } = this.state;
    const row = selectedTile.row + deltaY;
    const col = selectedTile.col + deltaX;
    if (row >= 0 && col >= 0) {
      this.setState({ selectedTile: { row, col } });
    }
  }
}

export default Tiles;

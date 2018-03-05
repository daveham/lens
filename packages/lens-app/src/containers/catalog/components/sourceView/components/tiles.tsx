import * as React from 'react';
import { throttle } from 'lodash';
import { makeTileImageKeyFromPrototype } from '@lens/image-descriptors';
import { IViewport, ITileSpec, ISelectedTile } from '../interfaces';
import { sizeFromViewport, calculateTileDimensions } from '../utils';
import MovablePanel from '../../../../../components/movablePanel';
import Selection from './selection';
import Tile from './tile';
import TileAnalysis from './tileAnalysis';

import styles from './styles.scss';

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

interface IState {
  viewport: IViewport;
  selectedTile: ISelectedTile;
  selectedStatsData: any;
}

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
    window.addEventListener('resize', this.controlledResize, false);
    setTimeout(() => {
      this.updateSize();
    }, 300);
  }

  public componentWillUnmount(): any {
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
    const { viewport } = this.state;
    if (prevState.viewport !== viewport && this.props.onSizeChanged) {
      setTimeout(() => {
        const { left, top } = viewport;
        const size = sizeFromViewport(viewport);
        this.props.onSizeChanged(left, top, size.width, size.height);
      }, 0);
    } else {
      this.detectClientSizeChange();
    }

    const { imageKey, x, y } = this.state.selectedTile;
    if (imageKey !== prevState.selectedTile.imageKey) {
      if (this.props.onTileSelectionChanged) {
        setTimeout(() => {
          const { top, left } = calculateTileDimensions(this.props.statsTileSpec, x, y);
          this.props.onTileSelectionChanged(imageKey, top, left);
        }, 0);
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
    const size = sizeFromViewport(this.state.viewport);
    if (!this.containerNode || !(size.width || size.height)) {
      return null;
    }

    const { res } = this.props.statsTileSpec;
    const { selectedTile: { x, y }, selectedStatsData } = this.state;

    const analysis = selectedStatsData ? (
      <TileAnalysis
        row={Math.floor(y / res)}
        col={Math.floor(x / res)}
        offsetX={x}
        offsetY={y}
        stats={selectedStatsData}
      />
    ) : null;

    return [(
      <Selection
        key='selection'
        statsTileSpec={this.props.statsTileSpec}
        viewport={this.state.viewport}
        selectedTile={this.state.selectedTile}
        onSelectionChanged={this.handleSelectionChanged}
      />
    ), (
      <MovablePanel
        key='info'
        initialLeft={200}
        initialTop={50}
        constrainRect={this.containerNode.getBoundingClientRect()}
      >
        {analysis}
      </MovablePanel>
    )];
  }

  private detectClientSizeChange() {
    if (this.containerNode) {
      const { clientWidth, clientHeight } = this.containerNode;
      const size = sizeFromViewport(this.state.viewport);
      const sizeChanged = size.width !== clientWidth || size.height !== clientHeight;
      if (sizeChanged) {
        const { left, top } = this.state.viewport;
        this.setState({
          viewport: {
            left, top,
            right: left + clientWidth,
            bottom: top + clientHeight
          }
        });
      }
    }
  }

  private handleSelectionChanged = (top: number, left: number, viewport: IViewport) => {
    const { res } = this.props.statsTileSpec;
    const nextState: any = {
      selectedTile: {
        x: left,
        y: top,
        imageKey: generateImageKey(this.props, res, left, top)
      }
    };
    if (viewport) {
      nextState.viewport = viewport;
    }
    this.setState(nextState);
  };

  private updateSize = () => {
    if (this.containerNode) {
      const { clientWidth, clientHeight } = this.containerNode;
      const size = sizeFromViewport(this.state.viewport);

      if (size.width !== clientWidth || size.height !== clientHeight) {
        const { left, top } = this.state.viewport;
        const viewport = {
          left, top,
          right: left + clientWidth,
          bottom: top + clientHeight
        };

        const { res, width, tilesWide, height, tilesHigh } = this.props.statsTileSpec;
        if (viewport.right - width > res) {
          const shiftX = viewport.right - tilesWide * res;
          viewport.left -= shiftX;
          viewport.right -= shiftX;
        }
        if (viewport.bottom - height > res) {
          const shiftY = viewport.bottom - tilesHigh * res;
          viewport.top -= shiftY;
          viewport.bottom -= shiftY;
        }

        const newState: any = { viewport };

        // ensure selected tile is within bounds of the new viewport
        const { x, y } = this.state.selectedTile;
        const adjustedX = Math.min(viewport.right, Math.max(viewport.left, x));
        const adjustedY = Math.min(viewport.bottom, Math.max(viewport.top, y));
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
}

export default Tiles;

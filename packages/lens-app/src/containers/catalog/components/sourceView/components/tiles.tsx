import * as React from 'react';
import { throttle } from 'lodash';
import { makeTileImageDescriptor } from '@lens/image-descriptors';
import styles from './styles.scss';
import { IStatsSpec } from '../../../utils';
import Tile from './tile';

import _debug from 'debug';
const debug = _debug('lens:sourceview:tiles');

interface ITileData {
  left: number;
  top: number;
  width: number;
  height: number;
  id: string;
}

interface IProps {
  sourceId: string;
  spec: IStatsSpec;
  x?: number;
  y?: number;
}

interface IState {
  width: number;
  height: number;
  x: number;
  y: number;
  tileData: ITileData[];
  prevX: number;
  prevY: number;
  prevLastX: number;
  prevLastY: number;
}

class Tiles extends React.Component<IProps, IState> {
  private containerNode: any;
  private controlledResize: () => void;

  constructor(props: IProps) {
    super(props);

    const x = props.x || 0;
    const y = props.y || 0;

    this.state = {
      width: 0,
      height: 0,
      x,
      y,
      tileData: [],
      prevX: -1,
      prevY: -1,
      prevLastX: -1,
      prevLastY: -1
    };

    this.controlledResize = throttle(this.updateSize, 50, { leading: true, trailing: true });
  }

  public componentDidMount(): any {
    window.addEventListener('resize', this.controlledResize, false);
    this.updateSize();
  }

  public componentWillUnmount(): any {
    window.removeEventListener('resize', this.controlledResize);
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (prevState.width !== this.state.width ||
      prevState.height !== this.state.height ||
      prevProps.spec !== this.props.spec) {
      this.calculateTiles();
    }
  }

  public render() {
    const { tileData } = this.state;
    const tiles = tileData.map((data, index) => {
      return (
        <Tile key={index} left={data.left} top={data.top} width={data.width} height={data.height} id={data.id}/>
      );
    });

    return (
      <div
        className={styles.tilesContainer}
        ref={(node) => this.containerNode = node}
      >
        {tiles}
      </div>
    );
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

  private calculateTiles() {
    const { x, y, width, height, prevX, prevY, prevLastX, prevLastY } = this.state;
    const { spec, sourceId } = this.props;
    const { res, tilesWide, tilesHigh } = spec;
    const viewWide = Math.floor((width + res - 1) / res);
    const viewHigh = Math.floor((height + res - 1) / res);
    const lastX = Math.min(tilesWide - 1, x + viewWide - 1);
    const lastY = Math.min(tilesHigh - 1, y + viewHigh - 1);

    if (x === prevX && y === prevY && lastX === prevLastX && lastY === prevLastY) {
      return;
    }

    debug(`y ${y}-${lastY}, x ${x}-${lastX}`);
    const data = [];
    for (let yIndex = y; yIndex <= lastY; yIndex++) {
      for (let xIndex = x; xIndex <= lastX; xIndex++) {
        const left = xIndex * res;
        const top = yIndex * res;
        data.push({
          left,
          width: res,
          top,
          height: res,
          id: makeTileImageDescriptor(sourceId, res, left, top, res, res)
        });
      }
      this.setState({
        tileData: data,
        prevX: x,
        prevY: y,
        prevLastX: lastX,
        prevLastY: lastY
      });
    }
  }
}

export default Tiles;

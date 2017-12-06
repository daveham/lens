import * as React from 'react';
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
}

class Tiles extends React.Component<IProps, IState> {
  private containerNode: any;

  constructor(props: IProps) {
    super(props);

    const x = props.x || 0;
    const y = props.y || 0;

    this.state = {
      width: 0,
      height: 0,
      x,
      y,
      tileData: []
    };
  }

  public componentDidMount(): any {
    this.calculateTiles();
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (prevState.width !== this.state.width ||
      prevState.height !== this.state.height ||
      prevProps.spec !== this.props.spec) {
      this.calculateTiles();
    }
  }

  public render() {
    const { width, height, tileData } = this.state;
    const { spec, x, y } = this.props;
    debug('render', { width, height, x, y, spec, tileData });

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

  private calculateTiles() {
    const rect = this.containerNode.getBoundingClientRect();
    const { x, y, width, height } = this.state;
    if (rect.width !== width || rect.height !== height) {
      const { res, tilesWide, tilesHigh } = this.props.spec;
      const viewWide = Math.floor((rect.width + res - 1) / res);
      const viewHigh = Math.floor((rect.height + res - 1) / res);
      const lastX = Math.min(tilesWide - 1, x + viewWide - 1);
      const lastY = Math.min(tilesHigh - 1, y + viewHigh - 1);
      let tileIndex = 0;
      const data = [];
      for (let yIndex = y; yIndex <= lastY; yIndex++) {
        for (let xIndex = x; xIndex <= lastX; xIndex++, tileIndex++) {
          data.push({
            left: xIndex * res,
            width: res,
            top: yIndex * res,
            height: res,
            id: tileIndex
          });
        }
      }
      this.setState({
        width: rect.width,
        height: rect.height,
        tileData: data
      });
    }
  }
}

export default Tiles;

import * as React from 'react';
import {
  makeTileImageDescriptor,
  makeTileStatsDescriptor,
  makeImageKey,
  makeStatsKey
} from '@lens/image-descriptors';
import { IStatsDescriptor, IImageDescriptor } from '../../../../interfaces';
import Loading from '../../../../components/loading';
import ToolButton from '../../../../components/toolButton';
import { createTileSpec, tileSizeFromSourceSpec, ITileSpec } from '../../utils';
import SourceThumbnail from '../sourceThumbnail';
import Details from './components/details';
import Tiles from './components/tiles';
import styles from './styles.scss';

// import _debug from 'debug';
// const debug = _debug('lens:sourceView');

export const displayTileResolution = 512;

interface IProps {
  sourceId: string;
  resolution: number;
  sourceStatsDescriptor: IStatsDescriptor;
  sourceStats: any;
  displayImages: any;
  tileStats: any;
  thumbnailImageDescriptor: IImageDescriptor;
  thumbnailUrl: string;
  ensureImage: (payload: {[name: string]: IImageDescriptor}) => void;
  ensureStats: (payload: {[name: string]: IStatsDescriptor}) => void;
  deleteStats: (payload: any) => void;
  ensureImages: (payload: {[imageDescriptors: string]: IImageDescriptor[]}) => void;
}

interface IState {
  statsSpec: ITileSpec;
  displaySpec: ITileSpec;
  displayImageKeys: ReadonlyArray<string>;
  selectedStatsKey?: string;
}

class View extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      statsSpec: null,
      displaySpec: null,
      displayImageKeys: []
    };
  }

  public componentDidMount(): any {
    const { sourceStats, thumbnailUrl } = this.props;

    if (sourceStats) {
      this.calculateTileSpecs(sourceStats);
    } else {
      this.requestSourceStat();
    }

    if (!thumbnailUrl) {
      this.requestThumbnailImage();
    }
  }

  public componentWillReceiveProps(nextProps: IProps): any {
    if (nextProps.sourceStats !== this.props.sourceStats) {
      this.calculateTileSpecs(nextProps.sourceStats);
    }
  }

  public render() {
    return (
      <div className={styles.container}>
        <div className={styles.divider}>
          <div className={styles.statsHeader}>
            <SourceThumbnail
              thumbnailUrl={this.props.thumbnailUrl}
              link={'/Catalog'}
            />
            {this.renderStats()}
            {this.renderTools()}
          </div>
          {this.renderTiles()}
        </div>
      </div>
    );
  }

  private renderStats() {
    if (this.state.statsSpec) {
      return <Details stats={this.props.sourceStats}/>;
    } else {
      return (
        <div className={styles.thumbnailLoading}>
          <Loading pulse={true}/>
        </div>
      );
    }
  }

  private renderTools() {
    if (this.state.statsSpec) {
      return (
        <div>
          <ToolButton title={'Reset Stats'} clickHandler={this.handleResetStats}/>
        </div>
      );
    }
    return null;
  }

  private renderTiles() {
    const { displaySpec, statsSpec } = this.state;
    if (statsSpec) {
      return (
        <div className={styles.tilesWrapper}>
          <Tiles
            statsTileSpec={statsSpec}
            displayTileSpec={displaySpec}
            imageKeys={this.state.displayImageKeys}
            images={this.props.displayImages}
            stats={this.props.tileStats}
            selectedStatsKey={this.state.selectedStatsKey}
            onSizeChanged={this.handleTilesViewportSizeChanged}
            onTileSelectionChanged={this.handleTileSelectionChanged}
          />
        </div>
      );
    }
    return null;
  }

  private handleTilesViewportSizeChanged = (left: number, top: number, width: number, height: number): void => {
    /*
      When size changes, recalculate image descriptors that fit the space.
      From image descriptors, generate image keys and store in component state.
      From image descriptors, ensure images.
     */

    const { sourceId, displayImages } = this.props;
    const { displaySpec } = this.state;
    const { res, tilesWide, tilesHigh, lastWidth, lastHeight } = displaySpec;

    const x = Math.floor(left / res);
    const y = Math.floor(top / res);
    const maxX = Math.floor((left + width + res - 1) / res);
    const maxY = Math.floor((top + height + res - 1) / res);
    const lastX = Math.min(tilesWide, maxX) - 1;
    const lastY = Math.min(tilesHigh, maxY) - 1;

    const imageDescriptors = [];
    const tileImageKeys = [];
    for (let yIndex = y; yIndex <= lastY; yIndex++) {
      const tileHeight = yIndex === tilesHigh - 1 ? lastHeight : res;
      for (let xIndex = x; xIndex <= lastX; xIndex++) {
        const left = xIndex * res;
        const top = yIndex * res;
        const tileWidth = xIndex === tilesWide - 1 ? lastWidth : res;
        const imageDescriptor = makeTileImageDescriptor(sourceId, res, left, top, tileWidth, tileHeight);
        const imageKey = makeImageKey(imageDescriptor);
        tileImageKeys.push(imageKey);
        if (!displayImages[imageKey]) {
          imageDescriptors.push(imageDescriptor);
        }
      }
    }
    this.setState({ displayImageKeys: tileImageKeys });
    if (imageDescriptors.length) {
      this.props.ensureImages({imageDescriptors});
    }
  };

  private handleTileSelectionChanged = (key: string, top: number, left: number): void => {
    const { width, height } = tileSizeFromSourceSpec(this.state.statsSpec, top, left);
    const group = this.state.statsSpec.res;
    const imageDescriptor = makeTileImageDescriptor(this.props.sourceId, group, left, top, width, height);
    const statsDescriptor = makeTileStatsDescriptor(imageDescriptor);
    const selectedStatsKey = makeStatsKey(statsDescriptor);
    if (!this.props.tileStats[selectedStatsKey]) {
      this.requestTileStat(statsDescriptor);
    }
    this.setState({ selectedStatsKey });
  };

  private calculateTileSpecs(sourceStats) {
    if (!sourceStats.loading) {
      const width = parseInt(sourceStats.width, 10);
      const height = parseInt(sourceStats.height, 10);
      setTimeout(() => {
        const displaySpec = createTileSpec(width, height, displayTileResolution);
        const statsSpec = createTileSpec(width, height, this.props.resolution);
        this.setState({ displaySpec, statsSpec });
      }, 0);
    }
  }

  private requestTileStat(statsDescriptor: IStatsDescriptor): void {
    setTimeout(() => {
      this.props.ensureStats({ statsDescriptor });
    }, 0);
  }

  private requestSourceStat(): void {
    setTimeout(() => {
      this.props.ensureStats({ statsDescriptor: this.props.sourceStatsDescriptor });
    }, 0);
  }

  private requestThumbnailImage(): void {
    setTimeout(() => {
      this.props.ensureImage({ imageDescriptor: this.props.thumbnailImageDescriptor });
    }, 0);
  }

  private handleResetStats = () => {
    const { sourceId, resolution } = this.props;
    this.props.deleteStats({
      sourceId,
      group: resolution
    });
  };
}

export default View;

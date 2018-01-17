import * as React from 'react';
import {
  makeTileImageDescriptor,
  makeTileStatsDescriptor,
  makeImageKey,
  makeStatsKey
} from '@lens/image-descriptors';
import { IStatsDescriptor, IImageDescriptor } from '../../../../interfaces';
import Loading from '../../../../components/loading';
import AutoScroll from '../../../../components/autoScroll';
import { createSourceSpec, tileSizeFromSourceSpec, IStatsSpec } from '../../utils';
import SourceThumbnail from '../sourceThumbnail';
import Details from './components/details';
import Tiles from './components/tiles';
import styles from './styles.scss';

import _debug from 'debug';
const debug = _debug('lens:sourceView');

interface IProps {
  sourceId: string;
  resolution: number;
  sourceStatsDescriptor: IStatsDescriptor;
  sourceStats: any;
  tileImages: any;
  tileStats: any;
  thumbnailImageDescriptor: IImageDescriptor;
  thumbnailUrl: string;
  ensureImage: (payload: {[name: string]: IImageDescriptor}) => void;
  ensureStats: (payload: {[name: string]: IStatsDescriptor}) => void;
  ensureImages: (payload: {[imageDescriptors: string]: IImageDescriptor[]}) => void;
}

interface IState {
  statsSpec: IStatsSpec;
  tileImageKeys: ReadonlyArray<string>;
  selectedStatsKey?: string;
}

class View extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      statsSpec: null,
      tileImageKeys: []
    };
  }

  public componentDidMount(): any {
    const { sourceStats, thumbnailUrl } = this.props;

    if (sourceStats) {
      this.calculateStatsSpec(sourceStats);
    } else {
      this.requestSourceStat();
    }

    if (!thumbnailUrl) {
      this.requestThumbnailImage();
    }
  }

  public componentWillReceiveProps(nextProps: IProps): any {
    if (nextProps.sourceStats !== this.props.sourceStats) {
      this.calculateStatsSpec(nextProps.sourceStats);
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

  private renderTiles() {
    const { statsSpec } = this.state;
    if (statsSpec) {
      return (
        <div className={styles.tilesWrapper}>
          <AutoScroll>
            <Tiles
              statsSpec={statsSpec}
              imageKeys={this.state.tileImageKeys}
              images={this.props.tileImages}
              stats={this.props.tileStats}
              selectedStatsKey={this.state.selectedStatsKey}
              onSizeChanged={this.handleTilesSizeChanged}
              onTileSelectionChanged={this.handleTileSelectionChanged}
            />
          </AutoScroll>
        </div>
      );
    }
    return null;
  }

  private handleTilesSizeChanged = (left: number, top: number, width: number, height: number): void => {
    /*
      When size changes, recalculate image descriptors that fit the space.
      From image descriptors, generate image keys and store in component state.
      From image descriptors, ensure images.
     */

    const { sourceId, tileImages } = this.props;
    const { statsSpec } = this.state;
    const { res, tilesWide, tilesHigh, lastWidth, lastHeight } = statsSpec;

    const x = left / res;
    const y = top / res;
    const viewWide = Math.floor((width + res - 1) / res);
    const viewHigh = Math.floor((height + res - 1) / res);
    const lastX = Math.min(tilesWide - 1, x + viewWide - 1);
    const lastY = Math.min(tilesHigh - 1, y + viewHigh - 1);

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
        if (!tileImages[imageKey]) {
          imageDescriptors.push(imageDescriptor);
        }
      }
    }
    this.setState({ tileImageKeys });
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

  private calculateStatsSpec(sourceStats) {
    if (!sourceStats.loading) {
      const width = parseInt(sourceStats.width, 10);
      const height = parseInt(sourceStats.height, 10);
      setTimeout(() => {
        const statsSpec = createSourceSpec(width, height, this.props.resolution);
        this.setState({ statsSpec });
      }, 0);
    }
  }

  private requestTileStat(statsDescriptor: IStatsDescriptor): void {
    setTimeout(() => {
      debug('requestTileStat', { statsDescriptor });
      this.props.ensureStats({ statsDescriptor });
    }, 0);
  }

  private requestSourceStat(): void {
    setTimeout(() => {
      debug('requestSourceStat', { statsDescriptor: this.props.sourceStatsDescriptor });
      this.props.ensureStats({ statsDescriptor: this.props.sourceStatsDescriptor });
    }, 0);
  }

  private requestThumbnailImage(): void {
    setTimeout(() => {
      debug('requestThumbnailImage', { imageDescriptor: this.props.thumbnailImageDescriptor});
      this.props.ensureImage({ imageDescriptor: this.props.thumbnailImageDescriptor });
    }, 0);
  }
}

export default View;

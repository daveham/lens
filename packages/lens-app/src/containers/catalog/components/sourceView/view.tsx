import * as React from 'react';
import { makeTileImageDescriptor, makeImageKey } from '@lens/image-descriptors';
import { IStatsDescriptor, IImageDescriptor } from '../../../../interfaces';
import Loading from '../../../../components/loading';
import AutoScroll from '../../../../components/autoScroll';
import { createSourceSpec, IStatsSpec } from '../../utils';
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
  thumbnailImageDescriptor: IImageDescriptor;
  thumbnailUrl: string;
  ensureImage: (payload: {[name: string]: IImageDescriptor}) => void;
  ensureStats: (payload: {[name: string]: IStatsDescriptor}) => void;
  ensureImages: (payload: {[imageDescriptors: string]: IImageDescriptor[]}) => void;
}

interface IState {
  statsSpec: IStatsSpec;
  tileImageKeys: ReadonlyArray<string>;
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

  private handleTilesSizeChanged = (width: number, height: number): void => {
    debug('handleTilesSizeChanged', { width, height });
    /*
      When size changes, recalculate image descriptors that fit the space.
      From image descriptors, generate image keys and store in component state.
      From image descriptors, ensure images.
     */

    const x = 0;
    const y = 0;
    const { sourceId } = this.props;
    const { statsSpec } = this.state;
    const { res, tilesWide, tilesHigh } = statsSpec;
    const viewWide = Math.floor((width + res - 1) / res);
    const viewHigh = Math.floor((height + res - 1) / res);
    const lastX = Math.min(tilesWide - 1, x + viewWide - 1);
    const lastY = Math.min(tilesHigh - 1, y + viewHigh - 1);

    const imageDescriptors = [];
    const tileImageKeys = [];
    for (let yIndex = y; yIndex <= lastY; yIndex++) {
      for (let xIndex = x; xIndex <= lastX; xIndex++) {
        const left = xIndex * res;
        const top = yIndex * res;
        const imageDescriptor = makeTileImageDescriptor(sourceId, res, left, top, res, res);
        tileImageKeys.push(makeImageKey(imageDescriptor));
        imageDescriptors.push(imageDescriptor);
      }
    }
    this.props.ensureImages({ imageDescriptors });
    this.setState({ tileImageKeys });
  };

  private calculateStatsSpec(sourceStats) {
    if (!sourceStats.loading) {
      const width = parseInt(sourceStats.width, 10);
      const height = parseInt(sourceStats.height, 10);
      setTimeout(() => {
        this.setState({
          statsSpec: createSourceSpec(width, height, this.props.resolution)
        });
      }, 0);
    }
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
              imageKeys={this.state.tileImageKeys}
              images={this.props.tileImages}
              onSizeChanged={this.handleTilesSizeChanged}
            />
          </AutoScroll>
        </div>
      );
    }
    return null;
  }

  private requestSourceStat(): void {
    setTimeout(() => {
      debug('requestSourceState', { statsDescriptor: this.props.sourceStatsDescriptor });
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

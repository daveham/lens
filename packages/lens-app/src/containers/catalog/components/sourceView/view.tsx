import * as React from 'react';
import {
  makeTileImageDescriptor,
  makeTileStatsDescriptor,
  makeImageKey,
  makeStatsKey
} from '@lens/image-descriptors';
import Loading from '../../../../components/loading';
import {
  IStatsDescriptor,
  IImageDescriptor,
  ITileSpec,
  IViewport
} from './interfaces';
import { createTileSpec, tileSizeFromSourceSpec } from './utils';
import SourceThumbnail from '../../../../components/sourceThumbnail';
import { Details, Tiles, Toolbar } from './components';

import styles from './styles.scss';

// import _debug from 'debug';
// const debug = _debug('lens:sourceView');

export const displayTileResolution = 512;

interface IProps {
  sourceId: string;
  resolution: number;
  sourceStatsDescriptor: IStatsDescriptor;
  sourceStats: ReadonlyArray<any>;
  displayImages: ReadonlyArray<any>;
  tileStats: ReadonlyArray<any>;
  thumbnailImageDescriptor: IImageDescriptor;
  thumbnailUrl: string;
  ensureImage: (payload: {[name: string]: IImageDescriptor}) => void;
  ensureStats: (payload: {[name: string]: IStatsDescriptor}) => void;
  deleteStats: (payload: any) => void;
  ensureImages: (payload: {[imageDescriptors: string]: ReadonlyArray<IImageDescriptor>}) => void;
  history: any;
}

interface IState {
  statsSpec: ITileSpec;
  displaySpec: ITileSpec;
  viewport: IViewport;
  displayImageKeys: ReadonlyArray<string>;
  pendingImageDescriptors: ReadonlyArray<IImageDescriptor>;
  selectedStatsDescriptor?: IStatsDescriptor;
  isSplit: boolean;
}

function calcStatsDescriptor(sourceId: string, statsSpec: ITileSpec,
                             top: number = 0, left: number = 0): IStatsDescriptor {
  const { width, height } = tileSizeFromSourceSpec(statsSpec, top, left);
  const group = statsSpec.res;
  const imageDescriptor = makeTileImageDescriptor(sourceId, group, left, top, width, height);
  return makeTileStatsDescriptor(imageDescriptor);
}

function calculateSpecs(sourceStats: any, resolution: number): any {
  if (sourceStats.loading) {
    return {};
  }

  const width = parseInt(sourceStats.width, 10);
  const height = parseInt(sourceStats.height, 10);
  const displaySpec = createTileSpec(width, height, displayTileResolution);
  const statsSpec = createTileSpec(width, height, resolution);
  return { statsSpec, displaySpec };
}

function calcTileKeysAndMissingDescriptors(sourceId: string, displayImages: any, displaySpec: ITileSpec,
                                           viewport: IViewport): any {
  const { left, top, right, bottom } = viewport;
  const width = right - left;
  const height = bottom - top;
  const { res, tilesWide, tilesHigh, lastWidth, lastHeight } = displaySpec;

  const x = Math.floor(left / res);
  const y = Math.floor(top / res);
  const maxX = Math.floor((left + width + res - 1) / res);
  const maxY = Math.floor((top + height + res - 1) / res);
  const lastX = Math.min(tilesWide, maxX) - 1;
  const lastY = Math.min(tilesHigh, maxY) - 1;

  const pendingImageDescriptors = [];
  const displayImageKeys = [];
  for (let yIndex = y; yIndex <= lastY; yIndex++) {
    const tileHeight = yIndex === tilesHigh - 1 ? lastHeight : res;
    for (let xIndex = x; xIndex <= lastX; xIndex++) {
      const left = xIndex * res;
      const top = yIndex * res;
      const tileWidth = xIndex === tilesWide - 1 ? lastWidth : res;
      const imageDescriptor = makeTileImageDescriptor(sourceId, res, left, top, tileWidth, tileHeight);
      const imageKey = makeImageKey(imageDescriptor);
      displayImageKeys.push(imageKey);
      if (!displayImages[imageKey]) {
        pendingImageDescriptors.push(imageDescriptor);
      }
    }
  }
  return { pendingImageDescriptors, displayImageKeys };
}

function calcInitialState(props: IProps): IState {
  let statsSpec;
  let displaySpec;
  let selectedStatsDescriptor;
  if (props.sourceStats && props.resolution) {
    const specs = calculateSpecs(props.sourceStats, props.resolution);
    statsSpec = specs.statsSpec;
    displaySpec = specs.displaySpec;
    if (props.sourceId) {
      selectedStatsDescriptor = calcStatsDescriptor(props.sourceId, statsSpec);
    }
  }

  return {
    statsSpec,
    displaySpec,
    viewport: { left: 0, top: 0, right: 0, bottom: 0 },
    displayImageKeys: [],
    pendingImageDescriptors: [],
    selectedStatsDescriptor,
    isSplit: false
  };
}

class View extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = calcInitialState(props);
  }

  public componentDidMount(): void {
    const { sourceStats, resolution, thumbnailUrl } = this.props;

    if (sourceStats) {
      this.calculateTileSpecs(sourceStats, resolution);
    } else {
      this.requestSourceStat();
    }

    if (!thumbnailUrl) {
      this.requestThumbnailImage();
    }

    const { selectedStatsDescriptor } = this.state;
    if (selectedStatsDescriptor) {
      const statsKey = makeStatsKey(selectedStatsDescriptor);
      if (!this.props.tileStats[statsKey]) {
        this.requestTileStat(selectedStatsDescriptor);
      }
    }
  }

  public componentWillReceiveProps(nextProps: IProps): void {
    if (nextProps.sourceStats !== this.props.sourceStats ||
      nextProps.resolution !== this.props.resolution) {
      this.calculateTileSpecs(nextProps.sourceStats, nextProps.resolution);
    }
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState): void {
    const { viewport } = this.state;
    if (prevState.viewport !== viewport) {
      const { pendingImageDescriptors, displayImageKeys } = calcTileKeysAndMissingDescriptors(
        this.props.sourceId,
        this.props.displayImages,
        this.state.displaySpec,
        viewport);

      this.setState({
        displayImageKeys,
        pendingImageDescriptors
      });
    }

    const { pendingImageDescriptors } = this.state;
    if (prevState.pendingImageDescriptors !== pendingImageDescriptors && pendingImageDescriptors.length) {
      this.props.ensureImages({ imageDescriptors: pendingImageDescriptors });
    }

    const { selectedStatsDescriptor } = this.state;
    if (prevState.selectedStatsDescriptor !== selectedStatsDescriptor) {
      const statsKey = makeStatsKey(selectedStatsDescriptor);
      if (!this.props.tileStats[statsKey]) {
        this.requestTileStat(selectedStatsDescriptor);
      }
    }
  }

  public render() {
    return (
      <div className={styles.container}>
        <div className={styles.divider}>
          <div className={styles.statsHeader}>
            <div className={styles.thumbnailWrapper}>
              <SourceThumbnail
                thumbnailUrl={this.props.thumbnailUrl}
                link={'/Catalog'}
              />
            </div>
            <div className={styles.statsAndTools}>
              {this.renderStats()}
              {this.renderTools()}
            </div>
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
        <div className={styles.toolbar}>
          <Toolbar
            resolution={this.props.resolution}
            onChangeRes={this.handleChangeRes}
            onResetStats={this.handleResetStats}
            onToggleSplit={this.handleToggleSplit}
          />
        </div>
      );
    }
    return null;
  }

  private renderTiles() {
    if (this.state.statsSpec) {
      const alternateView = this.state.isSplit ?
        (
          <div key='alternate' className={styles.alternateWrapper}>
            alternate
          </div>
        ) : null;

      const statsKey = makeStatsKey(this.state.selectedStatsDescriptor);

      return (
        <div className={styles.imageViewContainer}>
          <div key='tiles' className={styles.tilesWrapper}>
            <Tiles
              statsTileSpec={this.state.statsSpec}
              displayTileSpec={this.state.displaySpec}
              imageKeys={this.state.displayImageKeys}
              images={this.props.displayImages}
              stats={this.props.tileStats}
              selectedStatsKey={statsKey}
              onSizeChanged={this.handleTilesViewportSizeChanged}
              onTileSelectionChanged={this.handleTileSelectionChanged}
            />
          </div>
          {alternateView}
        </div>
      );
    }
    return null;
  }

  private buttonIndexFromResolution() {
    const { resolution } = this.props;
    if (resolution === 8) {
      return 2;
    }
    if (resolution === 16) {
      return 1;
    }
    return 0;
  }

  private calculateTileSpecs(sourceStats, resolution) {
    const { statsSpec, displaySpec } = calculateSpecs(sourceStats, resolution);
    if (statsSpec) {
      const selectedStatsDescriptor = calcStatsDescriptor(this.props.sourceId, statsSpec);

      setTimeout(() => {
        this.setState({
          displaySpec,
          statsSpec,
          selectedStatsDescriptor
        });
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

  private handleTilesViewportSizeChanged = (left: number, top: number, width: number, height: number): void => {
    this.setState({ viewport: {
      left, top,
      right: left + width,
      bottom: top + height
    }});
  };

  private handleTileSelectionChanged = (key: string, top: number, left: number): void => {
    const selectedStatsDescriptor = calcStatsDescriptor(
      this.props.sourceId,
      this.state.statsSpec,
      top, left);
    this.setState({ selectedStatsDescriptor });
  };

  private handleResetStats = () => {
    const { sourceId, resolution } = this.props;
    this.props.deleteStats({
      sourceId,
      group: resolution
    });
  };

  private handleChangeRes = (index: number) => {
    const currentIndex = this.buttonIndexFromResolution();
    if (currentIndex !== index) {
      const newResolution = [32, 16, 8][index];
      this.props.history.push(`/Catalog/Source/${this.props.sourceId}/${newResolution}`);
    }
  };

  private handleToggleSplit = () => {
    this.setState({ isSplit: !this.state.isSplit });
  }
}

export default View;

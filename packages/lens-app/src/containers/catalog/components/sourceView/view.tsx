import * as React from 'react';
import SourceThumbnail from '../sourceThumbnail';
import { IStatsDescriptor, IImageDescriptor } from '../../../../interfaces';
import Loading from '../../../../components/loading';
import Details from './components/details';
import Tiles from './components/tiles';
import AutoScroll from '../../../../components/autoScroll';
import { createSourceSpec, IStatsSpec } from '../../utils';
import styles from './styles.scss';

// import _debug from 'debug';
// const debug = _debug('lens:sourceView');

interface IProps {
  sourceId: string;
  sourceThumbnailUrl: string;
  sourceStatsDescriptor: IStatsDescriptor;
  sourceStats: any;
  ensureStats: (payload: {[name: string]: IStatsDescriptor}) => void;
  ensureImages: (payload: {[imageDescriptors: string]: IImageDescriptor[]}) => void;
}

interface IState {
  statsSpec: IStatsSpec;
}

class View extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = { statsSpec: null };
  }

  public componentDidMount(): any {
    const { sourceStats } = this.props;
    if (sourceStats) {
      this.getStatsSpec(sourceStats);
    } else {
      setTimeout(() => {
        this.props.ensureStats({ statsDescriptor: this.props.sourceStatsDescriptor });
      }, 0);
    }
  }

  public componentWillReceiveProps(nextProps: IProps): any {
    if (nextProps.sourceStats !== this.props.sourceStats) {
      this.getStatsSpec(nextProps.sourceStats);
    }
  }

  public render() {
    return (
      <div className={styles.container}>
        <div className={styles.divider}>
          <div className={styles.statsHeader}>
            <SourceThumbnail
              thumbnailUrl={this.props.sourceThumbnailUrl}
              link={'/Catalog'}
            />
            {this.renderStats()}
          </div>
          {this.renderTiles()}
        </div>
      </div>
    );
  }

  private getStatsSpec(sourceStats) {
    if (!sourceStats.loading) {
      const width = parseInt(sourceStats.width, 10);
      const height = parseInt(sourceStats.height, 10);
      const res = 32; // TODO: pass res through UI
      this.setState({statsSpec: createSourceSpec(width, height, res)});
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
              spec={statsSpec}
              sourceId={this.props.sourceId}
              ensureImages={this.props.ensureImages}
            />
          </AutoScroll>
        </div>
      );
    }
    return null;
  }
}

export default View;

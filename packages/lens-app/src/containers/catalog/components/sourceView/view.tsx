import * as React from 'react';
import SourceThumbnail from '../sourceThumbnail';
import { IStatsDescriptor } from '../../../../interfaces';
import Loading from '../../../../components/loading';
import Details from './components/details';
import AutoScroll from '../../../../components/autoScroll';
import styles from './styles.scss';

import _debug from 'debug';
const debug = _debug('lens:sourceView');

interface IProps {
  sourceThumbnailUrl: string;
  sourceStatsDescriptor: IStatsDescriptor;
  sourceStats: any;
  ensureStats: (payload: {[name: string]: IStatsDescriptor}) => void;
}

class View extends React.Component<IProps, any> {
  public componentDidMount(): any {
    if (!this.props.sourceStats) {
      setTimeout(() => {
        this.props.ensureStats({ statsDescriptor: this.props.sourceStatsDescriptor });
      }, 0);
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

  private renderStats() {
    const { sourceStats } = this.props;
    if (sourceStats && !sourceStats.loading) {
      debug('stats', { sourceStats });
      return (
        <div>
          <Details
            stats={sourceStats}
          />
        </div>
      );
    } else {
      return (
        <div className={styles.thumbnailLoading}>
          <Loading pulse={true}/>
        </div>
      );
    }
  }

  private renderTiles() {
    return (
      <div className={styles.tilesContainer}>
        <AutoScroll>
          <div>text</div>
        </AutoScroll>
      </div>
    );
  }
}

export default View;

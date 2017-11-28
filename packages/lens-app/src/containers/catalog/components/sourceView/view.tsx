import * as React from 'react';
import SourceThumbnail from '../sourceThumbnail';
import { IStatsDescriptor } from '../../../../interfaces';
import Loading from '../../../../components/loading';
import Details from './components/details';
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
        <SourceThumbnail
          thumbnailUrl={this.props.sourceThumbnailUrl}
          link={'/Catalog'}
        />
        {this.renderStats()}
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
}

export default View;

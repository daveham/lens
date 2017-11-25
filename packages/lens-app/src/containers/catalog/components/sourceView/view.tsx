import * as React from 'react';
import * as ReactRouterDom from 'react-router-dom';
import faStyles from 'font-awesome/scss/font-awesome.scss';
import FontAwesome from 'react-fontawesome';
import { IStatsDescriptor } from '../../../../interfaces';
import styles from './styles.scss';

interface IProps {
  sourceThumbnailUrl: string;
  sourceStatsDescriptor: IStatsDescriptor;
  sourceStats: any;
  ensureStats: (payload: {[name: string]: IStatsDescriptor}) => void;
}

class View extends React.Component<IProps, any> {
  private static renderThumbnail(url) {
    if (url) {
      return (
        <div className={styles.thumbnailItem}>
          <ReactRouterDom.Link to={'/Catalog'}>
            <img className={styles.thumbnailImage} src={url}/>
          </ReactRouterDom.Link>
        </div>
      );
    } else {
      return (
        <div className={styles.thumbnailLoading}>
          <FontAwesome name='spinner' cssModule={faStyles} pulse />
        </div>
      );
    }
  }

  public componentDidMount(): any {
    if (!(this.props.sourceStats && this.props.sourceStats.data)) {
      setTimeout(() => {
        this.props.ensureStats({ statsDescriptor: this.props.sourceStatsDescriptor });
      }, 0);
    }
  }

  public render() {
    return (
      <div className={styles.container}>
        {View.renderThumbnail(this.props.sourceThumbnailUrl)}
        {this.renderStats()}
      </div>
    );
  }

  private renderStats() {
    const { sourceStats } = this.props;
    if (sourceStats && sourceStats.loading) {
      return (
        <div className={styles.thumbnailLoading}>
          <FontAwesome name='spinner' cssModule={faStyles} pulse />
        </div>
      );
    } else {
      return (
        <div>stats go here</div>
      );
    }
  }
}

export default View;

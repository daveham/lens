import * as React from 'react';
import * as ReactRouterDom from 'react-router-dom';
import faStyles from 'font-awesome/scss/font-awesome.scss';
import FontAwesome from 'react-fontawesome';
import { default as getConfig } from '../../../../config';
import { ISourceDescriptor } from '../../../../interfaces';
import styles from './styles.scss';

interface IProps {
  match?: any;
  sources: ReadonlyArray<ISourceDescriptor>;
  thumbnailImageUrls: ReadonlyArray<string>;
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

  public render() {
    const { match } = this.props;
    const { id } = match.params;
    const { thumbnailImageUrls, sources } = this.props;
    const dataHost = getConfig().dataHost;
    const index = sources.findIndex((source) => source.id === id);
    const fullUrl = `${dataHost}${thumbnailImageUrls[index]}`;

    return (
      <div className={styles.container}>
        {View.renderThumbnail(fullUrl)}
      </div>
    );
  }
}

export default View;

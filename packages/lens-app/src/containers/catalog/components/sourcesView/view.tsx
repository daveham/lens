import * as React from 'react';
import * as ReactRouterDom from 'react-router-dom';
import faStyles from 'font-awesome/scss/font-awesome.scss';
import FontAwesome from 'react-fontawesome';
import { default as getConfig } from '../../../../config';
import { ISourceDescriptor } from '../../../../interfaces';
import styles from './styles.scss';

interface IProps {
  sources: ReadonlyArray<ISourceDescriptor>;
  thumbnailImageUrls: ReadonlyArray<string>;
}

class View extends React.Component<IProps, any> {
  private static renderThumbnail(url, id, name) {
    if (url) {
      return (
        <div key={id} className={styles.thumbnailItem}>
          <ReactRouterDom.Link to={`/Catalog/Source/${id}`}>
            <img className={styles.thumbnailImage} src={url}/>
          </ReactRouterDom.Link>
          <figcaption className={styles.thumbnailImageLabel}>{name}</figcaption>
        </div>
      );
    } else {
      return (
        <div key={id} className={styles.thumbnailLoading}>
          <FontAwesome name='spinner' cssModule={faStyles} pulse />
        </div>
      );
    }
  }

  public render() {
    const { thumbnailImageUrls, sources } = this.props;
    const dataHost = getConfig().dataHost;
    return (
      <div className={styles.container}>
        {thumbnailImageUrls.map((url, index) => {
          const source = sources[index];
          const { id, name } = source;
          const fullUrl = `${dataHost}${url}`;
          return View.renderThumbnail(fullUrl, id, name);
        })}
      </div>
    );
  }
}

export default View;

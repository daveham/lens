import * as React from 'react';
import * as ReactRouterDom from 'react-router-dom';
import faStyles from 'font-awesome/scss/font-awesome.scss';
import FontAwesome from 'react-fontawesome';
import { default as getConfig } from '../../../../config';
import { ISourceDescriptor, IThumbnailDescriptor } from '../../../../interfaces';
import styles from './styles.scss';

import debugLib from 'debug';
const debug = debugLib('lens:catalog:sourcesview');

interface IProps {
  loaded?: boolean;
  sources: ReadonlyArray<ISourceDescriptor>;
  thumbnailImageDescriptors: ReadonlyArray<IThumbnailDescriptor>;
  thumbnailImageUrls: ReadonlyArray<string>;
  ensureImage: (descriptors: {[name: string]: IThumbnailDescriptor}) => void;
}

class View extends React.Component<IProps, any> {
  public componentDidMount() {
    debug('componentDidMount');
    if (this.props.loaded) {
      const urlsNotLoaded =
        (this.props.thumbnailImageDescriptors && this.props.thumbnailImageDescriptors.length > 0) &&
        !(this.props.thumbnailImageUrls && this.props.thumbnailImageUrls.length > 0);
      if (urlsNotLoaded) {
        setTimeout(() => {
          debug('componentDidMount - ensureImage');
          this.props.thumbnailImageDescriptors.forEach((imageDescriptor) => {
            this.props.ensureImage({imageDescriptor});
          });
        }, 0);
      }
    }
  }

  public componentDidUpdate(prevProps: IProps) {
    const idsNowLoaded =
      !(prevProps.thumbnailImageDescriptors && prevProps.thumbnailImageDescriptors.length > 0) &&
      (this.props.thumbnailImageDescriptors && this.props.thumbnailImageDescriptors.length > 0);
    if (idsNowLoaded) {
      setTimeout(() => {
        debug('componentDidUpdate - ensureImage');
        this.props.thumbnailImageDescriptors.forEach((imageDescriptor) => {
          this.props.ensureImage({ imageDescriptor });
        });
      }, 0);
    }
  }

  public render() {
    return (
      <div className={styles.container}>
        {this.renderCatalog()}
      </div>
    );
  }

  private renderCatalog() {
    const { loaded, thumbnailImageUrls, sources } = this.props;
    return (
      loaded &&
      (
        <div className={styles.sourceListContainer}>
          {thumbnailImageUrls.map((url, index) => {
            const source = sources[index];
            const { id, name } = source;
            return this.renderThumbnail(url, id, name);
          })}
        </div>
      )
    );
  }

  private renderThumbnail(url, id, name) {
    if (url) {
      const dataHost = getConfig().dataHost;
      const restUrl = `${dataHost}${url}`;
      return (
        <div key={id} className={styles.thumbnailItem}>
          <ReactRouterDom.Link to={`/Catalog/Source/${id}`}>
            <img className={styles.thumbnailImage} src={restUrl}/>
          </ReactRouterDom.Link>
          <figcaption className={styles.thumbnailImageLabel}>{name}</figcaption>
        </div>
      );
    } else {
      return (
        <div key={id} className={styles.thumbnailLoading} onClick={this.handleImageClicked(id)}>
          <FontAwesome name='spinner' cssModule={faStyles} pulse />
        </div>
      );
    }
  }

  private handleImageClicked = (id) => (ignore) => {
    debug('handleImageClicked', { id });
  }
}

export default View;

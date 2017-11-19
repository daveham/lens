import * as React from 'react';
import faStyles from 'font-awesome/scss/font-awesome.scss';
import FontAwesome from 'react-fontawesome';
import { default as getConfig } from '../../../config';
import { ISourceDescriptor, IThumbnailDescriptor } from '../../../interfaces';
import styles from './styles.scss';

import debugLib from 'debug';
const debug = debugLib('lens:catalog:view');

interface IProps {
  loading?: boolean;
  loaded?: boolean;
  name?: string;
  sources: ReadonlyArray<ISourceDescriptor>;
  thumbnailImageDescriptors: ReadonlyArray<IThumbnailDescriptor>;
  thumbnailImageUrls: ReadonlyArray<string>;
  requestCatalog: () => void;
  ensureImage: (descriptors: {[name: string]: IThumbnailDescriptor}) => void;
}

class View extends React.Component<IProps, any> {
  public componentDidMount() {
    if (!(this.props.loaded || this.props.loading)) {
      setTimeout(() => {
        this.props.requestCatalog();
      }, 0);
    }
  }

  public componentDidUpdate(prevProps: IProps) {
    const idsLoaded = (!(prevProps.thumbnailImageDescriptors && prevProps.thumbnailImageDescriptors.length > 0) &&
      (this.props.thumbnailImageDescriptors && this.props.thumbnailImageDescriptors.length > 0));
    if (idsLoaded) {
      this.props.thumbnailImageDescriptors.forEach((imageDescriptor) => {
        this.props.ensureImage({ imageDescriptor });
      });
    }
  }

  public render() {
    return (
      <div className={styles.container}>
        {this.renderLoading()}
        {this.renderCatalog()}
      </div>
    );
  }

  private renderLoading() {
    const { loading } = this.props;
    return (
      loading &&
        <FontAwesome name='spinner' cssModule={faStyles} pulse />
    );
  }

  private renderCatalog() {
    const { loaded, name } = this.props;
    return (
      loaded &&
      (
        <div className={styles.content}>
          <div className={styles.catalogName}>{name}</div>
          {this.renderThumbnails()}
        </div>
      )
    );
  }

  private renderThumbnails() {
    const { thumbnailImageUrls, sources } = this.props;
    return (
      <div className={styles.sourceListContainer}>
        {thumbnailImageUrls.map((url, index) => {
          const source = sources[index];
          const { id, name } = source;
          return this.renderThumbnail(url, id, name);
        })}
      </div>
    );
  }

  private renderThumbnail(url, id, name) {
    if (url) {
      const dataHost = getConfig().dataHost;
      const restUrl = `${dataHost}${url}`;
      return (
        <div key={id} className={styles.thumbnailItem} onClick={this.handleImageClicked(id)}>
          <img className={styles.thumbnailImage} src={restUrl}/>
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

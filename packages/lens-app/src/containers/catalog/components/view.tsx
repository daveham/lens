import * as React from 'react';
import faStyles from 'font-awesome/scss/font-awesome.scss';
import FontAwesome from 'react-fontawesome';
import styles from './styles.scss';

import debugLib from 'debug';
const debug = debugLib('lens:catalog:view');

interface IConfig {
  dataHost: string;
}

const config: IConfig = {
  dataHost: process.env.REACT_APP_REST_SERVER
};

interface ISourceDescriptor {
  id: string;
  name: string;
  file: string;
}

interface IThumbnailDescriptor {
  id: string;
  file: string;
}

interface IEnsureImageLoadedPayload {
  [name: string]: IThumbnailDescriptor;
}

interface IProps {
  loading?: boolean;
  loaded?: boolean;
  name?: string;
  sources: ReadonlyArray<ISourceDescriptor>;
  thumbnailImageDescriptors: ReadonlyArray<IThumbnailDescriptor>;
  thumbnailImageUrls: ReadonlyArray<string>;
  requestCatalog: () => void;
  ensureImage: (payload: IEnsureImageLoadedPayload) => void;
}

class View extends React.Component<IProps, any> {
  public componentDidMount() {
    const { loading, loaded } = this.props;
    if (!(loaded || loading)) {
      setTimeout(() => {
        this.props.requestCatalog();
      }, 500);
    }
  }

  public componentDidUpdate(prevProps: IProps) {
    const idsLoaded = (!(prevProps.thumbnailImageDescriptors && prevProps.thumbnailImageDescriptors.length > 0) &&
      (this.props.thumbnailImageDescriptors && this.props.thumbnailImageDescriptors.length > 0));
    if (idsLoaded) {
      this.props.thumbnailImageDescriptors.forEach((imageDescriptor) => {
        debug('ensure image', imageDescriptor);
        this.props.ensureImage({ imageDescriptor });
      });
    }
  }

  public render() {
    debug('render');
    return (
      <div className={styles.container}>
        <div className={styles.data}>
          <h1>Catalog</h1>
          <div>This is the data catalog.</div>
          {this.renderLoading()}
          {this.renderCatalog()}
        </div>
      </div>
    );
  }

  private renderLoading() {
    const { loading } = this.props;
    return (
      loading &&
        <div>loading...</div>
    );
  }

  private renderCatalog() {
    const {loaded, name, thumbnailImageDescriptors} = this.props;
    debug('renderCatalog', {thumbnailImageDescriptors, loaded});
    return (
      loaded &&
      (
        <div>
          <div>{name}</div>
          {this.renderThumbnails()}
        </div>
      )
    );
  }

  private renderThumbnails() {
    const { thumbnailImageUrls, sources } = this.props;
    return (
      <div className={styles.sourceListContainer}>
        {thumbnailImageUrls.map((url, index) => this.renderThumbnail(url, sources[index].id))}
      </div>
    );
  }

  private renderThumbnail(url, id) {
    debug('renderSource', url);
    if (url) {
      const restUrl = `${config.dataHost}${url}`;
      return (
        <div key={id} className={styles.url} onClick={this.handleImageClicked(id)}>
          <img src={restUrl}/>
        </div>
      );
    } else {
      return (
        <div key={id} className={styles.url} onClick={this.handleImageClicked(id)}>
          <FontAwesome name='spinner' cssModule={faStyles} pulse />
        </div>
      );
    }
    // return (
    //   <div key={source.id} className={styles.source}>
    //     {source.id} - {source.name} ({source.file})
    //   </div>
    // );
  }

  private handleImageClicked = (id) => (e) => {
    debug('handleImageClicked', { id });
  }
}

export default View;

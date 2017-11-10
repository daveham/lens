import * as React from 'react';
import styles from './styles.scss';

import debugLib from 'debug';
const debug = debugLib('lens:catalog:view');

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
        debug('start loading', imageDescriptor);
        this.props.ensureImage({ imageDescriptor });
      });
    }
  }

  public render() {
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
    const { loaded, name, thumbnailImageDescriptors } = this.props;
    debug('renderCatalog', { thumbnailImageDescriptors });
    return (
      loaded &&
      (
        <div>
          <div>{name}</div>
          {this.renderSources()}
        </div>
      )
    );
  }

  private renderSources() {
    const { sources } = this.props;
    return (
      <div>
        {sources.map((source) => <div key={source.id}>{source.id} - {source.name} ({source.file})</div>)}
      </div>
    );
  }
}

export default View;

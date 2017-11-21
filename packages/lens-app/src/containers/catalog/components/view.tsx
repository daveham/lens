import * as React from 'react';
import * as ReactRouterDom from 'react-router-dom';
import faStyles from 'font-awesome/scss/font-awesome.scss';
import FontAwesome from 'react-fontawesome';
import SourcesView from './sourcesView';
import SourceView from './sourceView';
import { ISourceDescriptor, IThumbnailDescriptor } from '../../../interfaces';
import styles from './styles.scss';

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
  public componentDidMount(): any {
    if (!(this.props.loaded || this.props.loading)) {
      setTimeout(() => {
        this.props.requestCatalog();
      }, 0);
    } else {
      if (this.props.thumbnailImageUrls.length === 0) {
        this.requestImages();
      }
    }
  }

  public componentDidUpdate(prevProps: IProps): any {
    if (!prevProps.loaded && this.props.loaded && this.props.thumbnailImageUrls.length === 0) {
      this.requestImages();
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

  private requestImages() {
    setTimeout(() => {
      this.props.thumbnailImageDescriptors.forEach((imageDescriptor) => {
        this.props.ensureImage({imageDescriptor});
      });
    }, 0);
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
          <div>
            <ReactRouterDom.Switch>
              <ReactRouterDom.Route path='/Catalog/Source/:id' component={SourceView}/>
              <ReactRouterDom.Route component={SourcesView}/>
            </ReactRouterDom.Switch>
          </div>
        </div>
      )
    );
  }
}

export default View;

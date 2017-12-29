import * as React from 'react';
import * as ReactRouterDom from 'react-router-dom';
import Loading from '../../../components/loading';
import SourcesView from './sourcesView';
import SourceView from './sourceView';
// import { IThumbnailDescriptor } from '../../../interfaces';
import styles from './styles.scss';

interface IProps {
  catalogIsLoading?: boolean;
  catalogIsLoaded?: boolean;
//  thumbnailImageDescriptors: ReadonlyArray<IThumbnailDescriptor>;
//  thumbnailImageUrls: ReadonlyArray<string>;
  requestCatalog: () => void;
//  ensureImage: (descriptors: {[name: string]: IThumbnailDescriptor}) => void;
}

class View extends React.Component<IProps, any> {
  public componentDidMount(): any {
    if (!(this.props.catalogIsLoaded || this.props.catalogIsLoading)) {
      setTimeout(() => {
        this.props.requestCatalog();
      }, 0);
    // } else {
    //   if (this.props.thumbnailImageUrls.length === 0) {
    //     this.requestImages();
    //   }
    }
  }

  // public componentDidUpdate(prevProps: IProps): any {
  //   if (!prevProps.loaded && this.props.loaded && this.props.thumbnailImageUrls.length === 0) {
  //     this.requestImages();
  //   }
  // }

  public render() {
    return (
      <div className={styles.container}>
        {this.renderLoading()}
        {this.renderCatalog()}
      </div>
    );
  }

  // private requestImages() {
  //   setTimeout(() => {
  //     this.props.thumbnailImageDescriptors.forEach((imageDescriptor) => {
  //       this.props.ensureImage({imageDescriptor});
  //     });
  //   }, 0);
  // }

  private renderLoading() {
    return (
      this.props.catalogIsLoading &&
        <Loading pulse={true}/>
    );
  }

  private renderCatalog() {
    return (
      this.props.catalogIsLoaded &&
      (
        <div className={styles.content}>
          <ReactRouterDom.Switch>
            <ReactRouterDom.Route path='/Catalog/Source/:id' component={SourceView}/>
            <ReactRouterDom.Route component={SourcesView}/>
          </ReactRouterDom.Switch>
        </div>
      )
    );
  }
}

export default View;
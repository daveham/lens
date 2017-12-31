import * as React from 'react';
import * as ReactRouterDom from 'react-router-dom';
import Loading from '../../../components/loading';
import SourcesView from './sourcesView';
import SourceView from './sourceView';
import styles from './styles.scss';

interface IProps {
  catalogIsLoading?: boolean;
  catalogIsLoaded?: boolean;
  requestCatalog: () => void;
}

class View extends React.Component<IProps, any> {
  public componentDidMount(): any {
    if (!(this.props.catalogIsLoaded || this.props.catalogIsLoading)) {
      setTimeout(() => {
        this.props.requestCatalog();
      }, 0);
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
            <ReactRouterDom.Route path='/Catalog/Source/:id/:res' component={SourceView}/>
            <ReactRouterDom.Route component={SourcesView}/>
          </ReactRouterDom.Switch>
        </div>
      )
    );
  }
}

export default View;

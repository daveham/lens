import * as React from 'react';
import { Switch as RouterSwitch, Route as RouterRoute } from 'react-router-dom';
import Loading from '../../../components/loading';
import { simulationRoute } from '../../../routes';
import SourcesView from './sourcesView';
import SourceView from './sourceView';
import styles from './styles.scss';

// import _debug from 'debug';
// const debug = _debug('lens:catalog:view');

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
          <RouterSwitch>
            <RouterRoute path='/Catalog/Source/:id/:res' component={SourceView}/>
            <RouterRoute path='/Catalog/:id/Simulation' component={simulationRoute}/>
            <RouterRoute component={SourcesView}/>
          </RouterSwitch>
        </div>
      )
    );
  }
}

export default View;

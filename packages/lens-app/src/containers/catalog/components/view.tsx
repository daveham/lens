import * as React from 'react';
import * as ReactRouterDom from 'react-router-dom';
import faStyles from 'font-awesome/scss/font-awesome.scss';
import FontAwesome from 'react-fontawesome';
import SourcesView from './sourcesView';
import SourceView from './sourceView';
import styles from './styles.scss';

import debugLib from 'debug';
const debug = debugLib('lens:catalog:view');

interface IProps {
  loading?: boolean;
  loaded?: boolean;
  name?: string;
  requestCatalog: () => void;
}

class View extends React.Component<IProps, any> {
  public componentDidMount() {
    if (!(this.props.loaded || this.props.loading)) {
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
    const { loading } = this.props;
    return (
      loading &&
        <FontAwesome name='spinner' cssModule={faStyles} pulse />
    );
  }

  private renderCatalog() {
    const { loaded, name } = this.props;
    debug('renderCatalog', { loaded, name });
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

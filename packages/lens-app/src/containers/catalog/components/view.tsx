import * as React from 'react';
import { Switch as RouterSwitch, Route as RouterRoute } from 'react-router-dom';
import Loading from 'components/loading';
import { simulationRoute } from 'src/routes';
import SourcesView from './sourcesView';
import SourceView from './sourceView';
import { withStyles } from '@material-ui/core/styles';

// import _debug from 'debug';
// const debug = _debug('lens:catalog:view');

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  content: {
    height: '100vh',
    overflow: 'auto',
    width: '100%',
  }
};

interface IProps {
  classes: any;
  match: any;
  catalogIsLoading?: boolean;
  catalogIsLoaded?: boolean;
  requestCatalog: () => void;
}

class AppView extends React.Component<IProps, any> {
  public componentDidMount(): any {
    const { catalogIsLoaded, catalogIsLoading, requestCatalog } = this.props;
    if (!(catalogIsLoaded || catalogIsLoading)) {
      setTimeout(() => {
        requestCatalog();
      }, 0);
    }
  }

  public render() {
    return (
      <div className={this.props.classes.root}>
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
    const { classes: { content }, match: { path } } = this.props;

    return this.props.catalogIsLoaded &&
      (
        <div className={content}>
          <RouterSwitch>
            <RouterRoute path={`${path}/Source/:id/:res`} component={SourceView}/>
            <RouterRoute path={`${path}/:sourceId/Simulation`} component={simulationRoute}/>
            <RouterRoute component={SourcesView}/>
          </RouterSwitch>
        </div>
      );
  }
}

// @ts-ignore
export default withStyles(styles)(AppView);

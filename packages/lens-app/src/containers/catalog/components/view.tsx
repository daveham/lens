import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Loading } from 'components/loading';
import { editorRoute } from 'src/routes';
import { SourcesView } from './sourcesView';
import { SourceView } from './sourceView';
import { withStyles } from '@material-ui/core/styles';

// import _debug from 'debug';
// const debug = _debug('lens:catalog:view');

const styles: any = {
  root: {
    boxSizing: 'border-box',
    display: 'flex',
    flex: '1 0 auto',
    flexFlow: 'column',
  },
  content: {
    display: 'flex',
    flex: '1 0 auto',
  }
};

interface IProps {
  classes?: any;
  match: any;
  catalogIsLoading?: boolean;
  catalogIsLoaded?: boolean;
  requestCatalog: () => void;
}

class CatalogViewCmp extends React.Component<IProps, any> {
  componentDidMount(): void {
    const {
      catalogIsLoaded,
      catalogIsLoading,
      requestCatalog,
    } = this.props;

    if (!(catalogIsLoaded || catalogIsLoading)) {
      setTimeout(() => requestCatalog());
    }
  }

  render() {
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
          <Switch>
            <Route path={`${path}/Source/:id/:res`} component={SourceView}/>
            <Route path={`${path}/:sourceId/Simulation`} component={editorRoute}/>
            <Route component={SourcesView}/>
          </Switch>
        </div>
      );
  }
}

export const CatalogView = withStyles(styles)(CatalogViewCmp);

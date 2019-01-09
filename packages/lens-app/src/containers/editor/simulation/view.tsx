import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';

import { IThumbnailDescriptor } from 'src/interfaces';
import { backupUrl } from 'src/helpers';

import Header from '../components/header';
import simulationListRenderFunction from './simulationList';
import simulationEditRenderFunction from './simulationEdit';
import simulationNewRenderFunction from './simulationNew';
import simulationShowRenderFunction from './simulationShow';
import simulationDeleteRenderFunction from './simulationDelete';
import { withStyles } from '@material-ui/core/styles';
import { styles } from 'editor/styles/editorView';

// import _debug from 'debug';
// const debug = _debug('lens:editor:simulation:view');

interface IProps {
  classes?: any;
  match: any;
  thumbnailUrl?: string;
  thumbnailImageDescriptor: IThumbnailDescriptor;
  ensureImage: (payload: {[imageDescriptor: string]: IThumbnailDescriptor}) => void;
  ensureEditorTitle: (sourceId?: string) => void;
}

class View extends React.Component<IProps, any> {
  public componentDidMount(): void {
    const {
      thumbnailUrl,
      thumbnailImageDescriptor,
      ensureImage,
      ensureEditorTitle,
      match: { params: { sourceId } },
    } = this.props;

    ensureEditorTitle(sourceId);

    if (!thumbnailUrl) {
      ensureImage({ imageDescriptor: thumbnailImageDescriptor });
    }
  }

  public render(): any {
    const { classes, match: { path } } = this.props;
    return (
      <div className={classes.root}>
        <Switch>
          <Route path={`${path}/new`} render={this.renderSimulationNewToolbar} />
          <Route path={`${path}/:simulationId/delete`} render={this.renderSimulationDeleteToolbar} />
          <Route path={`${path}/:simulationId/edit`} render={this.renderSimulationEditToolbar} />
          <Route path={`${path}/:simulationId`} render={this.renderSimulationShowToolbar} />
          <Route path={path} render={this.renderSimulationListToolbar} />
        </Switch>
        <Fragment>
          <Switch>
            <Route path={`${path}/new`} render={simulationNewRenderFunction} />
            <Route path={`${path}/:simulationId/delete`} render={simulationDeleteRenderFunction} />
            <Route path={`${path}/:simulationId/edit`} render={simulationEditRenderFunction} />
            <Route path={`${path}/:simulationId`} render={simulationShowRenderFunction} />
            <Route path={path} render={simulationListRenderFunction} />
          </Switch>
        </Fragment>
      </div>
    );
  }

  private renderSimulationShowToolbar = (): any => {
    const { thumbnailUrl, match: { url } } = this.props;
    const links = {
      back: url
    };

    return (
      <Header
        title='Simulation'
        thumbnailUrl={thumbnailUrl}
        toolbarLinks={links}
      />
    );
  };

  private renderSimulationEditToolbar = (): any => {
    const { thumbnailUrl, match: { url } } = this.props;
    const links = {
      back: url
    };

    return (
      <Header
        title='Edit Simulation'
        thumbnailUrl={thumbnailUrl}
        toolbarLinks={links}
      />
    );
  };

  private renderSimulationDeleteToolbar = (): any => {
    const { thumbnailUrl } = this.props;
    return (
      <Header
        title='Delete Simulation'
        thumbnailUrl={thumbnailUrl}
      />
    );
  };

  private renderSimulationNewToolbar = (): any => {
    const { thumbnailUrl } = this.props;
    return (
      <Header
        title='New Simulation'
        thumbnailUrl={thumbnailUrl}
      />
    );
  };

  private renderSimulationListToolbar = () => {
    const { thumbnailUrl, match: { url } } = this.props;
    const links = {
      back: backupUrl(url, 2),
      newItem: `${url}/new`
    };

    return (
      <Header
        title='Simulations'
        thumbnailUrl={thumbnailUrl}
        toolbarLinks={links}
      />
    );
  };
}

export default withStyles(styles)(View);

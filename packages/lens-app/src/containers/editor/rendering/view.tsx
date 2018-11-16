import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';

import { IThumbnailDescriptor } from 'src/interfaces';
import { backupUrl } from 'src/helpers';

import Header from '../components/header';
import BreadcrumbBar from '../components/breadcrumbs';
import renderingListRenderFunction from './renderingList';
import renderingEditRenderFunction from './renderingEdit';
import renderingNewRenderFunction from './renderingNew';
import renderingShowRenderFunction from './renderingShow';
import renderingDeleteRenderFunction from './renderingDelete';

import { withStyles } from '@material-ui/core/styles';
import { styles } from 'editor/styles/editorView';

// import _debug from 'debug';
// const debug = _debug('lens:editor:rendering:view');

interface IProps {
  classes?: any;
  match: any;
  thumbnailUrl?: string;
  thumbnailImageDescriptor: IThumbnailDescriptor;
  ensureImage: (payload: {[imageDescriptor: string]: IThumbnailDescriptor}) => void;
  ensureEditorTitle: (sourceId?: string) => void;
}

class View extends React.Component<IProps, any> {
  public componentDidMount(): any {
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
          <Route path={`${path}/new`} render={this.renderRenderingNewToolbar} />
          <Route path={`${path}/:renderingId/delete`} render={this.renderRenderingDeleteToolbar} />
          <Route path={`${path}/:renderingId/edit`} render={this.renderRenderingEditToolbar} />
          <Route path={`${path}/:renderingId`} render={this.renderRenderingShowToolbar} />
          <Route path={path} render={this.renderRenderingListToolbar} />
        </Switch>
        <Fragment>
          <Switch>
            <Route path={`${path}/new`} render={renderingNewRenderFunction} />
            <Route path={`${path}/:renderingId/delete`} render={renderingDeleteRenderFunction} />
            <Route path={`${path}/:renderingId/edit`} render={renderingEditRenderFunction} />
            <Route path={`${path}/:renderingId`} render={renderingShowRenderFunction} />
            <Route path={path} render={renderingListRenderFunction} />
          </Switch>
        </Fragment>
      </div>
    );
  }

  private renderRenderingShowToolbar = (): any => {
    const { thumbnailUrl, match: { url, params: { simulationId, executionId } } } = this.props;
    const links = {
      back: url
    };

    return (
      <Header
        title='Rendering'
        breadcrumb={<BreadcrumbBar simulationId={simulationId} executionId={executionId} />}
        thumbnailUrl={thumbnailUrl}
        toolbarLinks={links}
      />
    );
  };

  private renderRenderingEditToolbar = (): any => {
    const { thumbnailUrl, match: { url, params: { simulationId, executionId } } } = this.props;
    const links = {
      back: backupUrl(url, 2)
    };

    return (
      <Header
        title='Edit Rendering'
        breadcrumb={<BreadcrumbBar simulationId={simulationId} executionId={executionId} />}
        thumbnailUrl={thumbnailUrl}
        toolbarLinks={links}
      />
    );
  };

  private renderRenderingDeleteToolbar = (): any => {
    const { thumbnailUrl, match: { params: { simulationId, executionId } } } = this.props;
    return (
      <Header
        title='Delete Rendering'
        breadcrumb={<BreadcrumbBar simulationId={simulationId} executionId={executionId} />}
        thumbnailUrl={thumbnailUrl}
      />
    );
  };

  private renderRenderingNewToolbar = (): any => {
    const { thumbnailUrl, match: { params: { simulationId, executionId } } } = this.props;
    return (
      <Header
        title='New Rendering'
        breadcrumb={<BreadcrumbBar simulationId={simulationId} executionId={executionId} />}
        thumbnailUrl={thumbnailUrl}
      />
    );
  };

  private renderRenderingListToolbar = (): any => {
    const { thumbnailUrl, match: { url, params: { simulationId, executionId } } } = this.props;
    const links = {
      back: backupUrl(url, 2),
      newItem: `${url}/new`
    };

    return (
      <Header
        title='Renderings'
        breadcrumb={<BreadcrumbBar simulationId={simulationId} executionId={executionId} />}
        thumbnailUrl={thumbnailUrl}
        toolbarLinks={links}
      />
    );
  };
}

export default withStyles(styles)(View);

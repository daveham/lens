import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';

import { IThumbnailDescriptor } from 'src/interfaces';
import { backupUrl } from 'src/helpers';

import Header from '../components/header';
import BreadcrumbBar from '../components/breadcrumbs';
import executionListRenderFunction from './executionList';
import executionEditRenderFunction from './executionEdit';
import executionNewRenderFunction from './executionNew';
import executionShowRenderFunction from './executionShow';
import executionDeleteRenderFunction from './executionDelete';

import { withStyles } from '@material-ui/core/styles';
import { styles } from 'editor/styles/editorView';

// import _debug from 'debug';
// const debug = _debug('lens:editor:execution:view');

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
          <Route path={`${path}/new`} render={this.renderExecutionNewToolbar} />
          <Route path={`${path}/:executionId/delete`} render={this.renderExecutionDeleteToolbar} />
          <Route path={`${path}/:executionId/edit`} render={this.renderExecutionEditToolbar} />
          <Route path={`${path}/:executionId`} render={this.renderExecutionShowToolbar} />
          <Route path={path} render={this.renderExecutionListToolbar} />
        </Switch>
        <Fragment>
          <Switch>
            <Route path={`${path}/new`} render={executionNewRenderFunction} />
            <Route path={`${path}/:executionId/delete`} render={executionDeleteRenderFunction} />
            <Route path={`${path}/:executionId/edit`} render={executionEditRenderFunction} />
            <Route path={`${path}/:executionId`} render={executionShowRenderFunction} />
            <Route path={path} render={executionListRenderFunction} />
          </Switch>
        </Fragment>
      </div>
    );
  }

  private renderExecutionShowToolbar = (): any => {
    const { thumbnailUrl, match: { url } } = this.props;
    const links = {
      back: url
    };

    return (
      <Header
        title='Execution'
        thumbnailUrl={thumbnailUrl}
        toolbarLinks={links}
      />
    );
  };

  private renderExecutionEditToolbar = (): any => {
    const { thumbnailUrl, match: { url, params: { simulationId } } } = this.props;
    const links = {
      back: backupUrl(url, 2)
    };

    return (
      <Header
        title='Edit Execution'
        breadcrumb={<BreadcrumbBar simulationId={simulationId} />}
        thumbnailUrl={thumbnailUrl}
        toolbarLinks={links}
      />
    );
  };

  private renderExecutionDeleteToolbar = (): any => {
    const { thumbnailUrl, match: { params: { simulationId } } } = this.props;
    return (
      <Header
        title='Delete Execution'
        breadcrumb={<BreadcrumbBar simulationId={simulationId} />}
        thumbnailUrl={thumbnailUrl}
      />
    );
  };

  private renderExecutionNewToolbar = (): any => {
    const { thumbnailUrl, match: { params: { simulationId } } } = this.props;
    return (
      <Header
        title='New Execution'
        breadcrumb={<BreadcrumbBar simulationId={simulationId} />}
        thumbnailUrl={thumbnailUrl}
      />
    );
  };

  private renderExecutionListToolbar = (): any => {
    const { thumbnailUrl, match: { url, params: { simulationId } } } = this.props;
    const links = {
      back: backupUrl(url, 2),
      newItem: `${url}/new`
    };

    return (
      <Header
        title='Executions'
        breadcrumb={<BreadcrumbBar simulationId={simulationId} />}
        thumbnailUrl={thumbnailUrl}
        toolbarLinks={links}
      />
    );
  };
}

export default withStyles(styles)(View);

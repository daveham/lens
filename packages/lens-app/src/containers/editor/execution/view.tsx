import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';

import { IThumbnailDescriptor } from 'src/interfaces';
import { backupUrl } from 'src/helpers';

import SourceThumbnail from 'components/sourceThumbnail';
import Header from '../components/header';
import BreadcrumbBar from '../components/breadcrumbs';
import executionListRenderFunction from './executionList';
import executionEditRenderFunction from './executionEdit';
import executionNewRenderFunction from './executionNew';
import executionDeleteRenderFunction from './executionDelete';
import ListToolbar from '../components/listToolbar';

import styles from './styles.scss';

// import _debug from 'debug';
// const debug = _debug('lens:editor:execution:view');

interface IProps {
  match: any;
  thumbnailUrl?: string;
  thumbnailImageDescriptor: IThumbnailDescriptor;
  ensureImage: (payload: {[imageDescriptor: string]: IThumbnailDescriptor}) => void;
}

class View extends React.Component<IProps, any> {
  public componentDidMount(): any {
    const {
      thumbnailUrl,
      thumbnailImageDescriptor,
      ensureImage
    } = this.props;

    if (!thumbnailUrl) {
      ensureImage({ imageDescriptor: thumbnailImageDescriptor });
    }
  }

  public render(): any {
    const { match: { path } } = this.props;
    return (
      <div className={styles.container}>
        <Switch>
          <Route path={`${path}/new`} render={this.renderExecutionNewToolbar} />
          <Route path={`${path}/:executionId/delete`} render={this.renderExecutionDeleteToolbar} />
          <Route path={`${path}/:executionId`} render={this.renderExecutionEditToolbar} />
          <Route path={path} render={this.renderExecutionListToolbar} />
        </Switch>
        <div className={styles.contents}>
          <Paper>
            <Switch>
              <Route path={`${path}/new`} render={executionNewRenderFunction} />
              <Route path={`${path}/:executionId/delete`} render={executionDeleteRenderFunction} />
              <Route path={`${path}/:executionId`} render={executionEditRenderFunction} />
              <Route path={path} render={executionListRenderFunction} />
            </Switch>
          </Paper>
        </div>
      </div>
    );
  }

  private renderExecutionEditToolbar = (): any => {
    const { thumbnailUrl, match: { url: back, params: { simulationId } } } = this.props;
    return (
      <Header
        title='Edit Execution'
        breadcrumb={<BreadcrumbBar simulationId={simulationId} />}
      >
        <ListToolbar links={{ back }} />
        {thumbnailUrl && <SourceThumbnail thumbnailUrl={thumbnailUrl} />}
      </Header>
    );
  };

  private renderExecutionDeleteToolbar = (): any => {
    const { thumbnailUrl, match: { params: { simulationId } } } = this.props;
    return (
      <Header
        title='Delete Execution'
        breadcrumb={<BreadcrumbBar simulationId={simulationId} />}
      >
        {thumbnailUrl && <SourceThumbnail thumbnailUrl={thumbnailUrl} />}
      </Header>
    );
  };

  private renderExecutionNewToolbar = (): any => {
    const { thumbnailUrl, match: { params: { simulationId } } } = this.props;
    return (
      <Header
        title='New Execution'
        breadcrumb={<BreadcrumbBar simulationId={simulationId} />}
      >
        {thumbnailUrl && <SourceThumbnail thumbnailUrl={thumbnailUrl} />}
      </Header>
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
      >
        <ListToolbar links={links} />
        {thumbnailUrl && <SourceThumbnail thumbnailUrl={thumbnailUrl} />}
      </Header>
    );
  };
}

export default View;

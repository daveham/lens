import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';

import { IThumbnailDescriptor } from 'src/interfaces';
import { backupUrl } from 'src/helpers';

import SourceThumbnail from 'components/sourceThumbnail';
import Header from '../components/header';
import BreadcrumbBar from '../components/breadcrumbs';
import renderingListRenderFunction from './renderingList';
import renderingEditRenderFunction from './renderingEdit';
import renderingNewRenderFunction from './renderingNew';
import renderingDeleteRenderFunction from './renderingDelete';
import ListToolbar from '../components/listToolbar';

import styles from './styles.scss';

// import _debug from 'debug';
// const debug = _debug('lens:editor:rendering:view');

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
          <Route path={`${path}/new`} render={this.renderRenderingNewToolbar} />
          <Route path={`${path}/:renderingId/delete`} render={this.renderRenderingDeleteToolbar} />
          <Route path={`${path}/:renderingId/edit`} render={this.renderRenderingEditToolbar} />
          <Route path={path} render={this.renderRenderingListToolbar} />
        </Switch>
        <div className={styles.contents}>
          <Paper>
            <Switch>
              <Route path={`${path}/new`} render={renderingNewRenderFunction} />
              <Route path={`${path}/:renderingId/delete`} render={renderingDeleteRenderFunction} />
              <Route path={`${path}/:renderingId/edit`} render={renderingEditRenderFunction} />
              <Route path={path} render={renderingListRenderFunction} />
            </Switch>
          </Paper>
        </div>
      </div>
    );
  }

  private renderRenderingEditToolbar = (): any => {
    const { thumbnailUrl, match: { url, params: { simulationId, executionId } } } = this.props;
    const links = {
      back: backupUrl(url, 2)
    };

    return (
      <Header
        title='Edit Rendering'
        breadcrumb={<BreadcrumbBar simulationId={simulationId} executionId={executionId} />}
      >
        <ListToolbar links={links} />
        {thumbnailUrl && <SourceThumbnail thumbnailUrl={thumbnailUrl} />}
      </Header>
    );
  };

  private renderRenderingDeleteToolbar = (): any => {
    const { thumbnailUrl, match: { params: { simulationId, executionId } } } = this.props;
    return (
      <Header
        title='Delete Rendering'
        breadcrumb={<BreadcrumbBar simulationId={simulationId} executionId={executionId} />}
      >
        {thumbnailUrl && <SourceThumbnail thumbnailUrl={thumbnailUrl} />}
      </Header>
    );
  };

  private renderRenderingNewToolbar = (): any => {
    const { thumbnailUrl, match: { params: { simulationId, executionId } } } = this.props;
    return (
      <Header
        title='New Rendering'
        breadcrumb={<BreadcrumbBar simulationId={simulationId} executionId={executionId} />}
      >
        {thumbnailUrl && <SourceThumbnail thumbnailUrl={thumbnailUrl} />}
      </Header>
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
      >
        <ListToolbar links={links} />
        {thumbnailUrl && <SourceThumbnail thumbnailUrl={thumbnailUrl} />}
      </Header>
    );
  };
}

export default View;

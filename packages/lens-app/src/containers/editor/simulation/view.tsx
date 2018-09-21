import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';

import { IThumbnailDescriptor } from 'src/interfaces';
import { backupUrl } from 'src/helpers';

import SourceThumbnail from 'components/sourceThumbnail';
import Header from '../components/header';
import simulationListRenderFunction from './simulationList';
import simulationEditRenderFunction from './simulationEdit';
import simulationNewRenderFunction from './simulationNew';
import simulationShowRenderFunction from './simulationShow';
import simulationDeleteRenderFunction from './simulationDelete';
import ListToolbar from '../components/listToolbar';

import styles from './styles.scss';

// import _debug from 'debug';
// const debug = _debug('lens:editor:simulation:view');

interface IProps {
  match: any;
  thumbnailUrl?: string;
  thumbnailImageDescriptor: IThumbnailDescriptor;
  ensureImage: (payload: {[imageDescriptor: string]: IThumbnailDescriptor}) => void;
}

class View extends React.Component<IProps, any> {
  public componentDidMount(): void {
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
          <Route path={`${path}/new`} render={this.renderSimulationNewToolbar} />
          <Route path={`${path}/:simulationId/delete`} render={this.renderSimulationDeleteToolbar} />
          <Route path={`${path}/:simulationId/edit`} render={this.renderSimulationEditToolbar} />
          <Route path={`${path}/:simulationId`} render={this.renderSimulationShowToolbar} />
          <Route path={path} render={this.renderSimulationListToolbar} />
        </Switch>
        <div className={styles.contents}>
          <Paper>
            <Switch>
              <Route path={`${path}/new`} render={simulationNewRenderFunction} />
              <Route path={`${path}/:simulationId/delete`} render={simulationDeleteRenderFunction} />
              <Route path={`${path}/:simulationId/edit`} render={simulationEditRenderFunction} />
              <Route path={`${path}/:simulationId`} render={simulationShowRenderFunction} />
              <Route path={path} render={simulationListRenderFunction} />
            </Switch>
          </Paper>
        </div>
      </div>
    );
  }

  private renderSimulationShowToolbar = (): any => {
    const { thumbnailUrl, match: { url } } = this.props;
    const links = {
      back: url
    };

    return (
      <Header title='Simulation'>
        <ListToolbar links={links} />
        {thumbnailUrl && <SourceThumbnail thumbnailUrl={thumbnailUrl} />}
      </Header>
    );
  };

  private renderSimulationEditToolbar = (): any => {
    const { thumbnailUrl, match: { url } } = this.props;
    const links = {
      back: backupUrl(url, 2)
    };

    return (
      <Header title='Edit Simulation'>
        <ListToolbar links={links} />
        {thumbnailUrl && <SourceThumbnail thumbnailUrl={thumbnailUrl} />}
      </Header>
    );
  };

  private renderSimulationDeleteToolbar = (): any => {
    const { thumbnailUrl } = this.props;
    return (
      <Header title='Delete Simulation'>
        {thumbnailUrl && <SourceThumbnail thumbnailUrl={thumbnailUrl} />}
      </Header>
    );
  };

  private renderSimulationNewToolbar = (): any => {
    const { thumbnailUrl } = this.props;
    return (
      <Header title='New Simulation'>
        {thumbnailUrl && <SourceThumbnail thumbnailUrl={thumbnailUrl} />}
      </Header>
    );
  };

  private renderSimulationListToolbar = () => {
    const { thumbnailUrl, match: { url } } = this.props;
    const links = {
      back: backupUrl(url, 2),
      newItem: `${url}/new`
    };

    return (
      <Header title='Simulations'>
        <ListToolbar links={links} />
        {thumbnailUrl && <SourceThumbnail thumbnailUrl={thumbnailUrl} />}
      </Header>
    );
  };
}

export default View;

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';

import { IThumbnailDescriptor } from '@src/interfaces';
import { backupUrl } from '@src/helpers';

import Header from '../components/header';
import SourceThumbnail from '@src/components/sourceThumbnail';
import simulationListRenderFunction from './simulationList';
import simulationEditRenderFunction from './simulationEdit';
import simulationNewRenderFunction from './simulationNew';
import ListToolbar from '../components/listToolbar';

import styles from './styles.scss';

// import _debug from 'debug';
// const debug = _debug('lens:simulation:view');

interface IProps {
  match: any;
  sourceId: string;
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
          <Route path={`${path}/:simulationId`} render={this.renderSimulationEditToolbar} />
          <Route path={path} render={this.renderSimulationListToolbar} />
        </Switch>
        <div className={styles.contents}>
          <Paper>
            <Switch>
              <Route path={`${path}/new`} render={this.renderSimulationNew} />
              <Route path={`${path}/:simulationId`} render={this.renderSimulationEdit} />
              <Route path={path} render={this.renderSimulationList} />
            </Switch>
          </Paper>
        </div>
      </div>
    );
  }

  private renderSimulationEdit = (props) => {
    const { match: { params: { simulationId } } } = props;
    const { sourceId } = this.props;
    return simulationEditRenderFunction({
      ...props,
      sourceId,
      simulationId
    });
  };

  private renderSimulationEditToolbar = (): any => {
    const { thumbnailUrl, match: { url } } = this.props;
    const links = {
      back: url
    };

    return (
      <Header title='Edit Simulation'>
        <ListToolbar links={links} />
        {thumbnailUrl && <SourceThumbnail thumbnailUrl={thumbnailUrl} />}
      </Header>
    );
  };

  private renderSimulationNew = (props) => {
    const { sourceId } = this.props;
    return simulationNewRenderFunction({ ...props, sourceId });
  };

  private renderSimulationNewToolbar = (): any => {
    const { thumbnailUrl } = this.props;

    return (
      <Header title='New Simulation'>
        {thumbnailUrl && <SourceThumbnail thumbnailUrl={thumbnailUrl} />}
      </Header>
    );
  };

  private renderSimulationList = (props) => {
    const { sourceId } = this.props;
    return simulationListRenderFunction({ ...props, sourceId });
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

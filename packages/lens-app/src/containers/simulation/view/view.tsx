import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';

import { IThumbnailDescriptor } from '../../../interfaces';

import Header from '../components/header';
import SourceThumbnail from '../../../components/sourceThumbnail';
import simulationListRenderFunction from '../components/simulationList';
import simulationEditRenderFunction from '../components/simulationEdit';
import simulationNewRenderFunction from '../components/simulationNew';
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
    return (
      <div className={styles.container}>
        {this.renderToolbar()}
        {this.renderContents()}
      </div>
    );
  }

  private renderSimulationEditToolbar = (): any => {
    const { thumbnailUrl } = this.props;

    return (
      <Header title='Edit Simulation'>
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
    const backUrl = url.substr(0, url.lastIndexOf('/', url.lastIndexOf('/') - 1));
    const links = {
      back: backUrl,
      newItem: `${url}/new`
    };

    return (
      <Header title='Simulations'>
        <ListToolbar links={links} />
        {thumbnailUrl && <SourceThumbnail thumbnailUrl={thumbnailUrl} />}
      </Header>
    );
  };

  private renderToolbar(): any {
    const { match: { path } } = this.props;
    return (
      <Switch>
        <Route path={`${path}/new`} render={this.renderSimulationNewToolbar} />
        <Route path={`${path}/:simulationId`} render={this.renderSimulationEditToolbar} />
        <Route path={path} render={this.renderSimulationListToolbar} />
      </Switch>
    );
  }

  private renderSimulationList = (props) => {
    const { sourceId } = this.props;
    return simulationListRenderFunction({ ...props, sourceId });
  };

  private renderSimulationEdit = (props) => {
    const { sourceId } = this.props;
    return simulationEditRenderFunction({ ...props, sourceId });
  };

  private renderSimulationNew = (props) => {
    const { sourceId } = this.props;
    return simulationNewRenderFunction({ ...props, sourceId });
  };

  private renderContents(): any {
    const { match: { path } } = this.props;
    return (
      <div className={styles.contents}>
        <Paper>
          <Switch>
            <Route path={`${path}/new`} render={this.renderSimulationNew} />
            <Route path={`${path}/:simulationId`} render={this.renderSimulationEdit} />
            <Route path={path} render={this.renderSimulationList} />
          </Switch>
        </Paper>
      </div>
    );
  }
}

export default View;

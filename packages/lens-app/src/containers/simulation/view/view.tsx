import React from 'react';
import Paper from '@material-ui/core/Paper';
import { Switch as RouterSwitch, Route as RouterRoute } from 'react-router-dom';

import { IThumbnailDescriptor } from '../../../interfaces';

import Header from '../components/header';
import SourceThumbnail from '../../../components/sourceThumbnail';
import simulationListRenderFunction from '../components/simulationList';
import simulationListToolbarRenderFunction from '../components/simulationList/toolbar';
import SimulationEdit from '../components/simulationEdit';
import SimulationEditToolbar from '../components/simulationEdit/toolbar';
import SimulationNew from '../components/simulationNew';
import SimulationNewToolbar from '../components/simulationNew/toolbar';
import styles from './styles.scss';

// import _debug from 'debug';
// const debug = _debug('lens:simulation:view');

interface IProps {
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
    const { thumbnailUrl } = this.props;

    return (
      <div className={styles.container}>
        <Header title='Simulations'>
          {this.renderToolbar()}
          {thumbnailUrl && <SourceThumbnail thumbnailUrl={thumbnailUrl} />}
        </Header>
        {this.renderContents()}
      </div>
    );
  }

  private renderSimulationListToolbar = (props) => {
    const { sourceId } = this.props;
    return simulationListToolbarRenderFunction({ ...props, sourceId });
  };

  /*
        <RouterRoute
          path='/Catalog/:sourceId/Simulation/:simulationId'
          component={SimulationEditToolbar}
        />
        <RouterRoute
          path='/Catalog/:sourceId/Simulation/new'
          component={SimulationNewToolbar}
        />
   */

  private renderToolbar(): any {
    return (
      <RouterSwitch>
        <RouterRoute
          path='/Catalog/:sourceId/Simulation/'
          render={this.renderSimulationListToolbar}
        />
      </RouterSwitch>
    );
  }

  private renderSimulationList = (props) => {
    const { sourceId } = this.props;
    return simulationListRenderFunction({ ...props, sourceId });
  };

  /*
            <RouterRoute
              path='/Catalog/:sourceId/Simulation/:simulationId'
              component={SimulationEdit}
            />
            <RouterRoute
              path='/Catalog/:sourceId/Simulation/new'
              component={SimulationNew}
            />
   */

  private renderContents(): any {
    return (
      <div className={styles.container}>
        <Paper>
          <RouterSwitch>
            <RouterRoute
              path='/Catalog/:sourceId/Simulation/'
              render={this.renderSimulationList}
            />
          </RouterSwitch>
        </Paper>
      </div>
    );
  }
}

export default View;

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';

import { IThumbnailDescriptor } from '../../../interfaces';

import Header from '../components/header';
import SourceThumbnail from '../../../components/sourceThumbnail';
import simulationListRenderFunction from '../components/simulationList';
import simulationListToolbarRenderFunction from '../components/simulationList/toolbar';
// import SimulationEdit from '../components/simulationEdit';
// import SimulationEditToolbar from '../components/simulationEdit/toolbar';
// import SimulationNew from '../components/simulationNew';
// import SimulationNewToolbar from '../components/simulationNew/toolbar';
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
        <Route
          path=`${path/:simulationId}`
          component={SimulationEditToolbar}
        />
        <Route
          path=`${path}/new`
          component={SimulationNewToolbar}
        />
   */

  private renderToolbar(): any {
    const { match: { path } } = this.props;
    return (
      <Switch>
        <Route
          path={path}
          render={this.renderSimulationListToolbar}
        />
      </Switch>
    );
  }

  private renderSimulationList = (props) => {
    const { sourceId } = this.props;
    return simulationListRenderFunction({ ...props, sourceId });
  };

  /*
            <Route
              path=`${path}/:simulationId`
              component={SimulationEdit}
            />
            <Route
              path=`${path}/new`
              component={SimulationNew}
            />
   */

  private renderContents(): any {
    const { match: { path } } = this.props;
    return (
      <div className={styles.contents}>
        <Paper>
          <Switch>
            <Route
              path={path}
              render={this.renderSimulationList}
            />
          </Switch>
        </Paper>
      </div>
    );
  }
}

export default View;

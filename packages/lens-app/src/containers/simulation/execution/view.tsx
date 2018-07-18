import React from 'react';
import Paper from '@material-ui/core/Paper';
import { Switch as RouterSwitch, Route as RouterRoute } from 'react-router-dom';

import { IThumbnailDescriptor } from '../../../interfaces';

import Header from '../components/header';
import SourceThumbnail from '../../../components/sourceThumbnail';
import styles from './styles.scss';
import executionListRenderFunction from './components/executionList';
import executionListToolbarRenderFunction from './components/executionList/toolbar';

// import _debug from 'debug';
// const debug = _debug('lens:execution:view');

interface IProps {
  sourceId: string;
  simulationId: number;
  simulationNames: {[id: number]: string};
  thumbnailUrl?: string;
  thumbnailImageDescriptor: IThumbnailDescriptor;
  ensureImage: (payload: {[imageDescriptor: string]: IThumbnailDescriptor}) => void;
  recordPathNames: (payload: any) => void;
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
        <Header title='Executions'>
          {this.renderNavigationPath()}
          {this.renderToolbar()}
          {thumbnailUrl && <SourceThumbnail thumbnailUrl={thumbnailUrl} />}
        </Header>
        {this.renderContents()}
      </div>
    );
  }

  private renderExecutionListToolbar = (props) => {
    const { sourceId, simulationId } = this.props;
    return executionListToolbarRenderFunction({ ...props, sourceId, simulationId });
  };

  /*
        <RouterRoute
          path='/Catalog/:sourceId/Simulation/:simulationId/Execution/:executionId'
          component={ExecutionEditToolbar}
        />
        <RouterRoute
          path='/Catalog/:sourceId/Simulation/:simulationId/Execution/new'
          component={ExecutionNewToolbar}
        />
   */

  private renderNavigationPath(): any {
    const {
      simulationId,
      simulationNames
    } = this.props;

    const simulationName = simulationNames[simulationId];

    return (
      <div className={styles.navigation}>
        <div className={styles.segment}><span className={styles.label}>simulation:</span> {simulationName}</div>
      </div>
    );
  }

  private renderToolbar(): any {
    return (
      <RouterSwitch>
        <RouterRoute
          path='/Catalog/:sourceId/Simulation/:simulationId/Execution'
          render={this.renderExecutionListToolbar}
        />
      </RouterSwitch>
    );
  }

  private renderExecutionList = (props) => {
    const { sourceId, simulationId, recordPathNames } = this.props;
    return executionListRenderFunction({ ...props, sourceId, simulationId, recordPathNames });
  };

  /*
            <RouterRoute
              path='/Catalog/:sourceId/Simulation/:simulationId/Execution/:executionId'
              component={ExecutionEdit}
            />
            <RouterRoute
              path='/Catalog/:sourceId/Simulation/:simulationId/Execution/new'
              component={ExecutionNew}
            />
   */

  private renderContents(): any {
    return (
      <div className={styles.contents}>
        <Paper>
          <RouterSwitch>
            <RouterRoute
              path='/Catalog/:sourceId/Simulation/:simulationId/Execution'
              render={this.renderExecutionList}
            />
          </RouterSwitch>
        </Paper>
      </div>
    );
  }
}

export default View;

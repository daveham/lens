import React from 'react';
import Paper from '@material-ui/core/Paper';
import { Switch as RouterSwitch, Route as RouterRoute } from 'react-router-dom';

import { IThumbnailDescriptor } from '../../../interfaces';

import Header from '../components/header';
import SourceThumbnail from '../../../components/sourceThumbnail';
import styles from './styles.scss';
import renderingListRenderFunction from './components/renderingList';
import renderingListToolbarRenderFunction from './components/renderingList/toolbar';

import _debug from 'debug';
const debug = _debug('lens:execution:view');

interface IProps {
  sourceId: string;
  simulationId: number;
  executionId: number;
  simulationNames: {[id: number]: string};
  executionNames: {[id: number]: string};
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
    const {
      simulationId,
      simulationNames,
      executionId,
      executionNames,
      thumbnailUrl
    } = this.props;

    const simulationName = simulationNames[simulationId];
    const executionName = executionNames[executionId];

    debug(`render: ${simulationName}/${executionName}`);

    return (
      <div className={styles.container}>
        <Header title='Renderings'>
          {this.renderToolbar()}
          {thumbnailUrl && <SourceThumbnail thumbnailUrl={thumbnailUrl} />}
        </Header>
        {this.renderContents()}
      </div>
    );
  }

  private renderRenderingListToolbar = (props) => {
    const { sourceId, simulationId, executionId } = this.props;
    return renderingListToolbarRenderFunction({ ...props, sourceId, simulationId, executionId });
  };

  /*
        <RouterRoute
          path='/Catalog/:sourceId/Simulation/:simulationId/Execution/:executionId/Rendering/:renderingId'
          component={RenderingEditToolbar}
        />
        <RouterRoute
          path='/Catalog/:sourceId/Simulation/:simulationId/Execution/:executionId/Rendering/new'
          component={RenderingNewToolbar}
        />
   */

  private renderToolbar(): any {
    return (
      <RouterSwitch>
        <RouterRoute
          path='/Catalog/:sourceId/Simulation/:simulationId/Execution/:executionId/Rendering'
          render={this.renderRenderingListToolbar}
        />
      </RouterSwitch>
    );
  }

  private renderRenderingList = (props) => {
    const { sourceId, simulationId, executionId, recordPathNames } = this.props;
    return renderingListRenderFunction({ ...props, sourceId, simulationId, executionId, recordPathNames });
  };

  /*
            <RouterRoute
              path='/Catalog/:sourceId/Simulation/:simulationId/Execution/:executionId/Rendering/:renderingId'
              component={RenderingEdit}
            />
            <RouterRoute
              path='/Catalog/:sourceId/Simulation/:simulationId/Execution/:executionId/Rendering/new'
              component={RenderingNew}
            />
   */

  private renderContents(): any {
    return (
      <div className={styles.contents}>
        <Paper>
          <RouterSwitch>
            <RouterRoute
              path='/Catalog/:sourceId/Simulation/:simulationId/Execution/:executionId/Rendering'
              render={this.renderRenderingList}
            />
          </RouterSwitch>
        </Paper>
      </div>
    );
  }
}

export default View;

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';

import { IThumbnailDescriptor } from '../../../interfaces';

import Header from '../components/header';
import SourceThumbnail from '../../../components/sourceThumbnail';
import styles from './styles.scss';
import executionListRenderFunction from './components/executionList';
import executionListToolbarRenderFunction from './components/executionList/toolbar';

// import _debug from 'debug';
// const debug = _debug('lens:execution:view');

interface IProps {
  match: any;
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

  /*
        <Route
          path={`${path}/:executionId`}
          component={ExecutionEditToolbar}
        />
        <Route
          path={`${path}/new`}
          component={ExecutionNewToolbar}
        />
   */

  private renderToolbar(): any {
    const { match: { path } } = this.props;
    return (
      <Switch>
        <Route
          path={path}
          render={this.renderExecutionListToolbar}
        />
      </Switch>
    );
  }

  private renderExecutionList = (props) => {
    const { sourceId, simulationId, recordPathNames } = this.props;
    return executionListRenderFunction({ ...props, sourceId, simulationId, recordPathNames });
  };

  /*
            <Route
              path={`${path}/:executionId`}
              component={ExecutionEdit}
            />
            <Route
              path={`${path}/new`}
              component={ExecutionNew}
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
              render={this.renderExecutionList}
            />
          </Switch>
        </Paper>
      </div>
    );
  }
}

export default View;

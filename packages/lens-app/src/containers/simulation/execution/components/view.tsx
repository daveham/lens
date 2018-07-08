import React from 'react';
import Paper from '@material-ui/core/Paper';

import { IThumbnailDescriptor } from '../../../../interfaces';
import { IExecution } from '../../interfaces';
import SourceThumbnail from '../../../../components/sourceThumbnail';
import ExecutionList from './executionList';
import Header from '../../components/header';
import ListToolbar from '../../components/listToolbar';
import styles from './styles.scss';

// import _debug from 'debug';
// const debug = _debug('lens:execution:view');

function renderError(error: any): any {
  return <div>`Error: ${error.message}`</div>;
}

function renderLoading(): any {
  return <div>'Loading...'</div>;
}

interface IProps {
  loading: boolean;
  error: any;
  executions: ReadonlyArray<IExecution>;
  simulationId: number;
  sourceId: string;
  simulationName: string;
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
    const {
      loading,
      thumbnailUrl,
      sourceId,
      simulationId,
      simulationName
    } = this.props;

    const links = {
      back: `/Catalog/${sourceId}/Simulation`,
      newItem: `/Catalog/${sourceId}/Simulation/${simulationId}/Execution/new`
    };

    return (
      <div className={styles.container}>
        <Header title='Executions' loading={loading}>
          <div>
            {`simulation: ${simulationName}`}
          </div>
          {!loading && <ListToolbar links={links} />}
          {thumbnailUrl && <SourceThumbnail thumbnailUrl={thumbnailUrl} />}
        </Header>
        {this.renderContents()}
      </div>
    );
  }

  private renderContents(): any {
    const { loading, error } = this.props;
    return (
      <div className={styles.contents}>
        <Paper>
          {loading && renderLoading()}
          {!loading && error && renderError(error)}
          {!loading && !error && this.renderExecutions()}
        </Paper>
      </div>
    );
  }

  private renderExecutions(): any {
    const {
      executions,
      sourceId,
      simulationId
    } = this.props;
    return (
      <ExecutionList
        executionRows={executions}
        sourceId={sourceId}
        simulationId={simulationId}
      />
    );
  }
}

export default View;

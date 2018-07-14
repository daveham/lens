import React from 'react';

import { IExecution } from '../../../interfaces';
import ExecutionTable from './executionTable';
import styles from './styles.scss';

// import _debug from 'debug';
// const debug = _debug('lens:executionList:view');

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
}

class View extends React.Component<IProps, any> {
  public render(): any {
    const {
      error,
      loading,
      executions,
      sourceId,
      simulationId
    } = this.props;

    return (
      <div className={styles.container}>
        {loading && renderLoading()}
        {!loading && error && renderError(error)}
        {!loading && !error && (
          <ExecutionTable
            executionRows={executions}
            sourceId={sourceId}
            simulationId={simulationId}
          />
        )}
      </div>
    );
  }
}

export default View;

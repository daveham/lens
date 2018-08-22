import React from 'react';

import { IExecution } from 'editor/interfaces';
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
  match: any;
  loading: boolean;
  error: any;
  executions: ReadonlyArray<IExecution>;
  simulationId: number;
  simulationName: string;
  recordPathNames: (payload: any) => void;
}

class View extends React.Component<IProps, any> {
  public componentDidMount(): void {
    if (this.props.simulationName) {
      this.recordNavigationPath();
    }
  }

  public componentDidUpdate(prevProps: IProps): void {
    if (this.props.simulationName && !prevProps.simulationName) {
      this.recordNavigationPath();
    }
  }

  public render(): any {
    const {
      error,
      loading,
      executions,
      match: { url }
    } = this.props;

    return (
      <div className={styles.container}>
        {loading && renderLoading()}
        {!loading && error && renderError(error)}
        {!loading && !error &&
          <ExecutionTable
            executionRows={executions}
            matchUrl={url}
          />
        }
      </div>
    );
  }

  private recordNavigationPath(): void {
    const { simulationId, simulationName, recordPathNames } = this.props;
    recordPathNames({ simulationId, simulationName });
  }
}

export default View;

import React from 'react';

import { IExecution } from 'editor/interfaces';
import ExecutionTable from './executionTable';
import styles from './styles.scss';

// import _debug from 'debug';
// const debug = _debug('lens:editor:execution:executionList:view');

function renderError(error: any): any {
  return <div>`Error: ${error.message}`</div>;
}

function renderLoading(): any {
  return <div>'Loading...'</div>;
}

interface IProps {
  url: string;
  loading: boolean;
  error: any;
  executions: ReadonlyArray<IExecution>;
}

class View extends React.Component<IProps, any> {
  public render(): any {
    const {
      error,
      loading,
      executions,
      url
    } = this.props;

    return (
      <div className={styles.container}>
        {loading && renderLoading()}
        {!loading && error && renderError(error)}
        {!loading && !error &&
          <ExecutionTable
            executionRows={executions}
            url={url}
          />
        }
      </div>
    );
  }
}

export default View;

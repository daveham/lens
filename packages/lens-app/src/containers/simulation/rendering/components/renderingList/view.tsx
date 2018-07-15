import React from 'react';

import { IRendering } from '../../../interfaces';
import RenderingTable from './renderingTable';
import styles from './styles.scss';

// import _debug from 'debug';
// const debug = _debug('lens:renderingList:view');

function renderError(error: any): any {
  return <div>`Error: ${error.message}`</div>;
}

function renderLoading(): any {
  return <div>'Loading...'</div>;
}

interface IProps {
  loading: boolean;
  error: any;
  renderings: ReadonlyArray<IRendering>;
  sourceId: string;
  simulationId: number;
  executionId: number;
}

class View extends React.Component<IProps, any> {
  public render(): any {
    const {
      error,
      loading,
      renderings,
      sourceId,
      simulationId,
      executionId
    } = this.props;

    return (
      <div className={styles.container}>
        {loading && renderLoading()}
        {!loading && error && renderError(error)}
        {!loading && !error && (
          <RenderingTable
            renderingRows={renderings}
            sourceId={sourceId}
            simulationId={simulationId}
            executionId={executionId}
          />
        )}
      </div>
    );
  }
}

export default View;

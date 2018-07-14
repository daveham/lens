import React from 'react';

import { ISimulation } from '../../interfaces';
import SimulationTable from './simulationTable';
import styles from './styles.scss';

// import _debug from 'debug';
// const debug = _debug('lens:simulationList:view');

function renderError(error: any): any {
  return <div>`Error: ${error.message}`</div>;
}

function renderLoading(): any {
  return <div>'Loading...'</div>;
}

interface IProps {
  loading: boolean;
  error: any;
  simulations: ReadonlyArray<ISimulation>;
  sourceId: string;
}

class View extends React.Component<IProps, any> {
  public render(): any {
    const {
      error,
      loading,
      simulations
    } = this.props;

    return (
      <div className={styles.container}>
        {loading && renderLoading()}
        {!loading && error && renderError(error)}
        {!loading && !error && <SimulationTable simulationRows={simulations}/>}
      </div>
    );
  }
}

export default View;

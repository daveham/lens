import React from 'react';

import { ISimulation } from 'editor/interfaces';
import SimulationTable from './simulationTable';
import styles from './styles.scss';

import _debug from 'debug';
const debug = _debug('lens:editor:simulation:simulationList:view');

function renderError(error: any): any {
  return <div>`Error: ${error.message}`</div>;
}

function renderLoading(): any {
  return <div>'Loading...'</div>;
}

interface IProps {
  error: any;
  loading: boolean;
  simulations: ReadonlyArray<ISimulation>;
  url: string;
}

class View extends React.Component<IProps, any> {
  public render(): any {
    const {
      error,
      loading,
      simulations,
      url
    } = this.props;
    debug('render', { url });

    return (
      <div className={styles.container}>
        {loading && renderLoading()}
        {!loading && error && renderError(error)}
        {!loading && !error &&
          <SimulationTable
            simulationRows={simulations}
            url={url}
          />
        }
      </div>
    );
  }
}

export default View;

import React from 'react';
import { ISimulation } from '../../interfaces';
import styles from './styles.scss';

// import _debug from 'debug';
// const debug = _debug('lens:simulationEdit:view');

interface IProps {
  sourceId: string;
  simulation: ISimulation;
  loading: boolean;
}

class View extends React.Component<IProps, any> {
  public render(): any {
    if (this.props.loading) {
      return null;
    }

    const { simulation, sourceId } = this.props;
    return (
      <div className={styles.container}>
        {`Edit simulation ${simulation.id} for source ${sourceId}`}
      </div>
    );
  }
}

export default View;

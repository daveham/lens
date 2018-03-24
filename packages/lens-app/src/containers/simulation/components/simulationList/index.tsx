import * as React from 'react';
import SimulationRow from '../simulationRow';
import styles from './styles.scss';

interface ISimulationRow {
  id: number;
  name: string;
}

interface IProps {
  simulationRows: ISimulationRow[];
}

export default ({ simulationRows }: IProps) => {
  return (
    <div className={styles.container}>
      {simulationRows.map((r, index) => <SimulationRow key={index} id={r.id} name={r.name} />)}
    </div>
  );
};

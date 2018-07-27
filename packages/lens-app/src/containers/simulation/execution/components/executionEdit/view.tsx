import React from 'react';
import { IExecution } from '../../../interfaces';
import styles from './styles.scss';

interface IProps {
  sourceId: string;
  execution: IExecution;
  loading: boolean;
}

class View extends React.Component<IProps, any> {
  public render(): any {
    if (this.props.loading) {
      return null;
    }

    const { execution, sourceId } = this.props;
    const label = `Edit execution ${execution.id} belonging to simulation ${execution.simulationId}` +
      ` for source ${sourceId}`;
    return (
      <div className={styles.container}>
        {label}
      </div>
    );
  }
}

export default View;

import React from 'react';
import styles from './styles.scss';

interface IProps {
  simulationId: number;
  executionId: number;
}

class View extends React.Component<IProps, any> {
  public render(): any {
    return (
      <div className={styles.container}>
        {`Edit rendering belonging to execution ${this.props.executionId}`}
      </div>
    );
  }
}

export default View;

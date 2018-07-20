import React from 'react';
import styles from './styles.scss';

interface IProps {
  simulationId: number;
}

class View extends React.Component<IProps, any> {
  public render(): any {
    return (
      <div className={styles.container}>
        {`Add new execution to simulation ${this.props.simulationId}`}
      </div>
    );
  }
}

export default View;

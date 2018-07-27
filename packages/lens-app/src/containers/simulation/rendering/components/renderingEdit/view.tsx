import React from 'react';
import { IRendering } from '../../../interfaces';
import styles from './styles.scss';

interface IProps {
  sourceId: string;
  rendering: IRendering;
  loading: boolean;
}

class View extends React.Component<IProps, any> {
  public render(): any {
    if (this.props.loading) {
      return null;
    }

    const { rendering, sourceId } = this.props;
    const label = `Edit rendering ${rendering.id} belonging to execution ${rendering.executionId},` +
      ` simulation ${rendering.simulationId} on source ${sourceId}`;
    return (
      <div className={styles.container}>
        {label}
      </div>
    );
  }
}

export default View;

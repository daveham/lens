import React from 'react';
import styles from './styles.scss';

interface IProps {
  sourceId: string;
}

class View extends React.Component<IProps, any> {
  public render(): any {
    return (
      <div className={styles.container}>
        {`Add new simulation ${this.props.sourceId}`}
      </div>
    );
  }
}

export default View;

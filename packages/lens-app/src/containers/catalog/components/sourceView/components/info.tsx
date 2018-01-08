import * as React from 'react';
import styles from './styles.scss';

interface IProps {
  title?: string;
}

interface IState {
  title?: string;
}

class Info extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      title: props.title || 'no title'
    };
  }

  public render(): any {
    return (
      <div className={styles.infoContainer}>
        {this.state.title}
      </div>
    );
  }
}

export default Info;

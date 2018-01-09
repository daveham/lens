import * as React from 'react';
import styles from './styles.scss';

interface IProps {
  row: number;
  col: number;
  offsetX: number;
  offsetY: number;
}

interface IState {
  title: string;
}

function formatTitle(props: IProps) {
  return `location: ${props.col}, ${props.row} (${props.offsetX}, ${props.offsetY})`;
}

class Info extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      title: formatTitle(props)
    };
  }

  public componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.row !== this.props.row || nextProps.col !== this.props.col) {
      this.setState({
        title: formatTitle(nextProps)
      });
    }
  }

  public render(): any {
    return (
      <div className={styles.infoContainer}>
        <div className={styles.title}>
          {this.state.title}
        </div>
      </div>
    );
  }
}

export default Info;

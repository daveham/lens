import * as React from 'react';
import path from 'path';
import styles from './styles.scss';

interface IProps {
  row: number;
  col: number;
  offsetX: number;
  offsetY: number;
  stats: any;
}

interface IState {
  title: string;
}

function formatTitle(props: IProps) {
  return `location: ${props.col}, ${props.row} (${props.offsetX}, ${props.offsetY})`;
}

class TileAnalysis extends React.Component<IProps, IState> {
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
    const { loading, data } = this.props.stats;
    const filename = (!loading && data && data.filename) ?
      `file: ${path.basename(data.filename)}` : '';
    const filenameOrLoading = loading ? 'loading...' : filename;
    const filenameElement = filenameOrLoading ? <div className={styles.statsFilename}>{filenameOrLoading}</div> : null;
    return (
      <div className={styles.infoContainer}>
        <div className={styles.statsTitle}>
          {this.state.title}
        </div>
        {filenameElement}
      </div>
    );
  }
}

export default TileAnalysis;

import * as React from 'react';
import path from 'path';
import styles from './styles.scss';

import _debug from 'debug';
const debug = _debug('lens:tile-analysis');

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
  private relativeMax: number;

  constructor(props: IProps) {
    super(props);

    this.state = {
      title: formatTitle(props)
    };
    this.relativeMax = 0;
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
    const hasData = !loading && data && data.filename;
    const filename = hasData ? `file: ${path.basename(data.filename)}` : '';
    const filenameOrLoading = loading ? 'loading...' : filename;
    const filenameElement = filenameOrLoading ? <div className={styles.statsFilename}>{filenameOrLoading}</div> : null;
    return (
      <div className={styles.infoContainer}>
        <div className={styles.statsTitle}>
          {this.state.title}
        </div>
        {hasData && this.renderHistogram()}
        {filenameElement}
      </div>
    );
  }

  private renderHistogram(): any {
    const barHeight = 14;
    const { histogram } = this.props.stats.data.red;
    const barStyle = styles.histBarRed;
    const maxValue = histogram.reduce((a, b) => Math.max(a, b));
    this.relativeMax = Math.max(maxValue, this.relativeMax);
    debug('renderHistogram', { maxValue });
    const rects = histogram.reverse().map((value, index) => {
      return (
        <rect
          key={index}
          className={barStyle}
          x={0}
          y={index * (barHeight + 2)}
          width={`${100 * value / this.relativeMax}%`}
          height={barHeight}
        />
      );
    });

    return (
      <div>
        <svg className={styles.svgBox}>
          <g transform={`translate(${5},${5}) scale(.95, 1)`}>
            {rects}
          </g>
        </svg>
      </div>
    );
  }
}

export default TileAnalysis;

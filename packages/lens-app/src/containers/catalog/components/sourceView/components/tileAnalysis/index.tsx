import * as React from 'react';
import path from 'path';
import Histogram from './histogram';
import Menu from './menu';
import styles from './styles.scss';

interface IProps {
  row: number;
  col: number;
  offsetX: number;
  offsetY: number;
  stats: any;
}

interface IState {
  channel: string;
}

function formatTitle(props: IProps) {
  return `location: ${props.col}, ${props.row} (${props.offsetX}, ${props.offsetY})`;
}

const channelMap = {
  r: 'red',
  g: 'green',
  b: 'blue',
  h: 'hue',
  s: 'saturation',
  l: 'luminance'
};

const channelStylesMap = {
  r: styles.histBarRed,
  g: styles.histBarGreen,
  b: styles.histBarBlue,
  h: styles.histBarHue,
  s: styles.histBarSaturation,
  l: styles.histBarLuminance
};

class TileAnalysis extends React.Component<IProps, IState> {
  private relativeMaxMap: any;

  constructor(props: IProps) {
    super(props);
    this.relativeMaxMap = { r: 0, g: 0, b: 0, h: 0, s: 0, l: 0 };
    this.state = { channel: 'r' };
  }

  public render(): any {
    const { loading, data } = this.props.stats;
    const hasData = !loading && data && data.filename;
    return (
      <div className={styles.infoContainer}>
        {this.renderMenu()}
        {this.renderHistogram(hasData)}
        {this.renderDetails(hasData)}
      </div>
    );
  }

  private relativeMax(histogram: number[]): number {
    const maxValue = histogram.reduce((a, b) => Math.max(a, b));
    const { channel } = this.state;
    const relativeMax = Math.max(maxValue, this.relativeMaxMap[channel]);
    this.relativeMaxMap[channel] = relativeMax;
    return relativeMax;
  }

  private renderHistogram(hasData: boolean): any {
    if (!hasData) {
      return <div className={styles.histContainer}/>;
    }

    const histogram = this.channelData();
    const barStyle = this.channelStyle();

    return <Histogram data={histogram} barStyle={barStyle} barMax={this.relativeMax(histogram)} />;
  }

  private renderDetails(hasData: boolean): any {
    const filename = hasData ? path.basename(this.props.stats.data.filename) : '...';
    const filenameOrLoading = `file: ${filename}`;
    return (
      <div className={styles.statsTitle}>
        <div>{filenameOrLoading}</div>
        <div>{formatTitle(this.props)}</div>
      </div>
    );
  }

  private renderMenu(): any {
    return (
      <Menu
        initialChannel={this.state.channel}
        onChannelChanged={this.handleChannelChanged}
      />
    );
  }

  private channelData(): any {
    const channelName = channelMap[this.state.channel] || 'red';
    return this.props.stats.data[channelName].histogram;
  }

  private channelStyle(): any {
    return channelStylesMap[this.state.channel] || styles.histBarRed;
  }

  private handleChannelChanged = (channel) => {
    if (channel !== this.state.channel) {
      this.setState({ channel });
    }
  };
}

export default TileAnalysis;

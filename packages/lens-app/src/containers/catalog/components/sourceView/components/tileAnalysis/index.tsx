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

class TileAnalysis extends React.Component<IProps, IState> {
  private relativeMax: number;

  constructor(props: IProps) {
    super(props);
    this.relativeMax = 0;
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

  private renderHistogram(hasData: boolean): any {
    if (!hasData) {
      return <div className={styles.histContainer}/>;
    }

    const histogram = this.channelData();
    const barStyle = this.channelStyle();

    const maxValue = histogram.reduce((a, b) => Math.max(a, b));
    this.relativeMax = Math.max(maxValue, this.relativeMax);

    return <Histogram data={histogram} barStyle={barStyle} barMax={this.relativeMax} />;
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
    const { channel } = this.state;
    switch (channel) {
      case 'r':
        return this.props.stats.data.red.histogram;
      case 'g':
        return this.props.stats.data.green.histogram;
      case 'b':
        return this.props.stats.data.blue.histogram;
      case 'h':
        return this.props.stats.data.hue.histogram;
      case 's':
        return this.props.stats.data.saturation.histogram;
      case 'l':
        return this.props.stats.data.luminance.histogram;
      default:
        return this.props.stats.data.red.histogram;
    }
  }

  private channelStyle(): any {
    const { channel } = this.state;
    switch (channel) {
      case 'r':
        return styles.histBarRed;
      case 'g':
        return styles.histBarGreen;
      case 'b':
        return styles.histBarBlue;
      case 'h':
        return styles.histBarHue;
      case 's':
        return styles.histBarSaturation;
      case 'l':
        return styles.histBarLuminance;
      default:
        return styles.histBarRed;
    }
  }

  private handleChannelChanged = (channel) => {
    if (channel !== this.state.channel) {
      this.setState({ channel });
    }
  };
}

export default TileAnalysis;

import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import path from 'path';
import Histogram from './histogram';
import Menu from './menu';

// import _debug from 'debug';
// const debug = _debug('lens:catalog:tileAnalysis');

interface IProps {
  classes: any;
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

const infoTextColor = '#222';
const infoWidth = 150;
const infoHeight = 170;
const histContainerWidth = infoWidth;
const histContainerHeight = infoHeight - 40;

const styles: any = (theme) => ({
  histBarRed: {
    stroke: '#fcc',
    strokeWidth: 1,
    fill: '#ffd8d8',
  },
  histBarGreen: {
    stroke: '#ada',
    strokeWidth: 1,
    fill: '#c8eec8',
  },
  histBarBlue: {
    stroke: '#cce',
    strokeWidth: 1,
    fill: '#d8d8ff',
  },
  histBarHue: {
    stroke: '#9dd',
    strokeWidth: 1,
    fill: '#aee',
  },
  histBarSaturation: {
    stroke: '#fcf',
    strokeWidth: 1,
    fill: '#ffd8ff',
  },
  histBarLuminance: {
    stroke: '#f0e68c',
    strokeWidth: 1,
    fill: '#fdff62',
  },
  infoContainer: {
    color: infoTextColor,
    fontSize: '8pt',
    fontFamily: theme.typography.fontFamily,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    minWidth: infoWidth,
    minHeight: infoHeight,
  },
  histContainer: {
    width: histContainerWidth,
    height: histContainerHeight,
  },
  statsTitle: {
    paddingLeft: 2,
    display: 'flex',
    minHeight: 26,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  statsFilename: {
    paddingLeft: 2,
  },
});

class TileAnalysis extends React.Component<IProps, IState> {
  private relativeMaxMap: any;

  constructor(props: IProps) {
    super(props);
    this.relativeMaxMap = { r: 0, g: 0, b: 0, h: 0, s: 0, l: 0 };
    this.state = { channel: 'r' };

    const { classes } = props;
    // @ts-ignore
    this.channelStylesMap = {
      r: classes.histBarRed,
      g: classes.histBarGreen,
      b: classes.histBarBlue,
      h: classes.histBarHue,
      s: classes.histBarSaturation,
      l: classes.histBarLuminance
    };
  }

  public render(): any {
    const { classes, stats: { loading, data } } = this.props;
    const hasData = !loading && data && data.filename;
    return (
      <div className={classes.infoContainer}>
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
      return <div className={this.props.classes.histContainer}/>;
    }

    const histogram = this.channelData();
    const barStyle = this.channelStyle();

    return <Histogram data={histogram} barStyle={barStyle} barMax={this.relativeMax(histogram)} />;
  }

  private renderDetails(hasData: boolean): any {
    const filename = hasData ? path.basename(this.props.stats.data.filename) : '...';
    const filenameOrLoading = `file: ${filename}`;
    return (
      <div className={this.props.classes.statsTitle}>
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
    // @ts-ignore
    return this.channelStylesMap[this.state.channel] || this.channelStylesMap.r;
  }

  private handleChannelChanged = (channel) => {
    if (channel !== this.state.channel) {
      this.setState({ channel });
    }
  };
}

export default withStyles(styles)(TileAnalysis);

import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import path from 'path';
import Histogram from './histogram';
import Menu from './menu';

// import getDebugLog from './debugLog';
// const debug = getDebugLog();

interface IProps {
  classes?: any;
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

const styles: any = (theme) => {
  const { analysis } = theme.editor;
  const { bar, details, histogram } = analysis;

  return {
    histBarRed: {
      stroke: bar.barRed.strokeColor,
      strokeWidth: 1,
      fill: bar.barRed.fillColor,
    },
    histBarGreen: {
      stroke: bar.barGreen.strokeColor,
      strokeWidth: 1,
      fill: bar.barGreen.fillColor,
    },
    histBarBlue: {
      stroke: bar.barBlue.strokeColor,
      strokeWidth: 1,
      fill: bar.barBlue.fillColor,
    },
    histBarHue: {
      stroke: bar.barHue.strokeColor,
      strokeWidth: 1,
      fill: bar.barHue.fillColor,
    },
    histBarSaturation: {
      stroke: bar.barSaturation.strokeColor,
      strokeWidth: 1,
      fill: bar.barSaturation.fillColor,
    },
    histBarLuminance: {
      stroke: bar.barLuminance.strokeColor,
      strokeWidth: 1,
      fill: bar.barLuminance.fillColor,
    },
    root: {
      minWidth: analysis.width,
      minHeight: analysis.height,
      color: theme.palette.text.primary,
      fontSize: analysis.fontSize,
      fontFamily: theme.typography.fontFamily,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    histogramContainer: {
      minWidth: analysis.width,
      minHeight: histogram.height,
    },
    detailsContainer: {
      minWidth: analysis.width,
      minHeight: details.height,
      paddingLeft: 2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  };
};

export class TileAnalysisCmp extends React.Component<IProps, IState> {
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
      <div className={classes.root}>
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
      return <div className={this.props.classes.histogramContainer}/>;
    }

    const histogram = this.channelData();
    const barStyle = this.channelStyle();

    return <Histogram data={histogram} barStyle={barStyle} barMax={this.relativeMax(histogram)} />;
  }

  private renderDetails(hasData: boolean): any {
    const filename = hasData ? path.basename(this.props.stats.data.filename) : '...';
    const filenameOrLoading = `file: ${filename}`;
    return (
      <div className={this.props.classes.detailsContainer}>
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

export const TileAnalysis = withStyles(styles)(TileAnalysisCmp);

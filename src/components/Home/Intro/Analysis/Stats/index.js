import * as React from 'react';
import PropTypes from 'prop-types';
import path from 'path';
import Histogram from './histogram';
import Menu from './menu';
import styles from './styles.scss';

function formatTitle(props) {
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

export default class Stats extends React.Component {
  constructor(props) {
    super(props);
    this.relativeMaxMap = { r: 0, g: 0, b: 0, h: 0, s: 0, l: 0 };
    this.state = { channel: 'r' };
  }

  render() {
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

  relativeMax(histogram) {
    const maxValue = histogram.reduce((a, b) => Math.max(a, b));
    const { channel } = this.state;
    const relativeMax = Math.max(maxValue, this.relativeMaxMap[channel]);
    this.relativeMaxMap[channel] = relativeMax;
    return relativeMax;
  }

  renderHistogram(hasData) {
    if (!hasData) {
      return <div className={styles.histContainer}/>;
    }

    const histogram = this.channelData();
    const barStyle = this.channelStyle();

    return <Histogram data={histogram} barStyle={barStyle} barMax={this.relativeMax(histogram)} />;
  }

  renderDetails(hasData) {
    const filename = hasData ? path.basename(this.props.stats.data.filename) : '...';
    const filenameOrLoading = `file: ${filename}`;
    return (
      <div className={styles.statsTitle}>
        <div>{filenameOrLoading}</div>
        <div>{formatTitle(this.props)}</div>
      </div>
    );
  }

  renderMenu() {
    return (
      <Menu
        initialChannel={this.state.channel}
        onChannelChanged={this.handleChannelChanged}
      />
    );
  }

  channelData() {
    const channelName = channelMap[this.state.channel] || 'red';
    return this.props.stats.data[channelName].histogram;
  }

  channelStyle() {
    return channelStylesMap[this.state.channel] || styles.histBarRed;
  }

  handleChannelChanged = (channel) => {
    if (channel !== this.state.channel) {
      this.setState({ channel });
    }
  };
}

Stats.propTypes = {
  row: PropTypes.number,
  col: PropTypes.number,
  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
  stats: PropTypes.object
};

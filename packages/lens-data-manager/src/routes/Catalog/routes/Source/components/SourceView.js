import React, { Component, PropTypes } from 'react';
import Explorer from './Explorer';
import Summary from './Summary';

import styles from './SourceView.scss';

export class SourceView extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    catalogLoaded: PropTypes.bool.isRequired,
    sourceStatsDescriptor: PropTypes.object.isRequired,
    thumbnailImageUrl: PropTypes.string.isRequired,
    stats: PropTypes.object,
    ensureStats: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      currentRow: 0,
      currentCol: 0,
      currentRes: 64
    };
  }

  componentDidMount() {
    if (this.props.catalogLoaded) {
      this.props.ensureStats(this.props.sourceStatsDescriptor);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.catalogLoaded && nextProps.catalogLoaded) {
      this.props.ensureStats(nextProps.sourceStatsDescriptor);
    }
  }

  handleMoveToTile(row, column) {
    const newState = {};
    if (row !== this.state.currentRow) newState.currentRow = row;
    if (column !== this.state.currentCol) newState.currentCol = column;
    this.setState(newState);
  }

  render() {
    const stats = this.props.stats || {};
    const { currentRow, currentCol, currentRes } = this.state;

    const width = parseInt(stats.width);
    const height = parseInt(stats.height);
    const tileWidth = currentRes;
    const tileHeight = currentRes;
    let tilesWide = Math.floor(width / tileWidth);
    let tilesHigh = Math.floor(height / tileHeight);
    let lastWidth = width - tilesWide * tileWidth;
    let lastHeight = height - tilesHigh * tileHeight;
    if (lastWidth > 0) {
      tilesWide += 1;
    } else {
      lastWidth = tileWidth;
    }
    if (lastHeight > 0) {
      tilesHigh += 1;
    } else {
      lastHeight = tileHeight;
    }

    const sourceSpec = {
      width, height, tileWidth, tileHeight, tilesWide, tilesHigh, lastWidth, lastHeight
    };

    return (
      <div className={styles.container}>
        <div className={styles.summarySection}>
          <Summary
            stats={stats}
            thumbnailImageUrl={this.props.thumbnailImageUrl}
          />
        </div>
        <div className={styles.explorerSection}>
          <Explorer
            id={this.props.id}
            row={currentRow}
            column={currentCol}
            sourceSpec={sourceSpec}
            onMove={this.handleMoveToTile.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default SourceView;

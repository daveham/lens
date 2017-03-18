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
            width={parseInt(stats.width)}
            height={parseInt(stats.height)}
            row={currentRow}
            column={currentCol}
            tileWidth={currentRes}
            tileHeight={currentRes}
            onMove={this.handleMoveToTile.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default SourceView;

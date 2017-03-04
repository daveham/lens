import React, { Component, PropTypes } from 'react';

import debugLib from 'debug';
const debug = debugLib('app:module:source-view');

import styles from './SourceView.scss';

export class SourceView extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    catalogLoaded: PropTypes.bool.isRequired,
    sourceStatsDescriptor: PropTypes.object.isRequired,
    stats: PropTypes.object,
    ensureStats: PropTypes.func.isRequired
  };

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

  renderThumbnail() {
    const { id, stats } = this.props;
    debug('renderThumbnail', { stats });
    if (this.props.catalogLoaded) {
      return (
        <div className={styles.container}>
          test-{id}
          <p>
            {JSON.stringify(stats)}
          </p>
        </div>
      );
    } else {
      return (
        <div className={styles.container}>
          loading test-{id}
        </div>
      );
    }
  }

  render() {
    return this.renderThumbnail();
  }
}

export default SourceView;

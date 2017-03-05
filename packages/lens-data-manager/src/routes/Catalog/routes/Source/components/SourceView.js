import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

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
        <div className={styles.source}>
          test-{id}
          <p>
            {JSON.stringify(stats)}
          </p>
        </div>
      );
    } else {
      return (
        <div className={styles.source}>
          loading test-{id}
        </div>
      );
    }
  }

  render() {
    return (
      <div className={styles.container}>
        { this.renderThumbnail() }
        <Link to={'/catalog'}>back to catalog</Link>
      </div>
    );
  }
}

export default SourceView;

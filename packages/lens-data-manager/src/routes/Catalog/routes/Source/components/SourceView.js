import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Details from './Details';

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
    return (
      <div className={styles.thumbnailSection}>
        <img className={styles.thumbnail} src={this.props.thumbnailImageUrl}/>
      </div>
    );
  }

  renderExplorer() {
    return (
      <div>
        { 'To Do...' }
      </div>
    );
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.summarySection}>
          <div className={styles.returnToCatalog}>
            <Link to={'/catalog'}><span className='glyphicon glyphicon-circle-arrow-left'></span></Link>
          </div>
          { this.renderThumbnail() }
          <Details
            stats={this.props.stats || {}}
          />
        </div>
        <div className={styles.exploreSection}>
          { this.renderExplorer() }
        </div>
      </div>
    );
  }
}

export default SourceView;

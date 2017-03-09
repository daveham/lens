import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import moment from 'moment';

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

  renderDetails() {
    const stats = this.props.stats || {};
    const loading = '...';
    const details = [
      { l: 'Modified', v: 'ctime', c: (v) =>  moment(v).format('h:mm a, MM/DD/YY') },
      { l: 'Size', v: 'size', c: (v) => v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') },
      { l: 'Format', v: 'format' },
      { l: 'Width', v: 'width' },
      { l: 'Height', v: 'height' },
      { l: 'Depth', v: 'depth' },
      { l: 'Resolution', v: 'resolution' },
      { l: 'File Size', v: 'filesize' }
    ];

    const rows = details.map((detail, index) => {
      let value = stats[detail.v];
      if (value) {
        if (detail.c) {
          value = detail.c(value);
        }
      } else {
        value = loading;
      }
      return (
        <div key={index} className={styles.detailsRow}>
          <div className={styles.detailsLabel}>{ detail.l }</div><div className={styles.detail}>{ value }</div>
        </div>
      );
    });

    return (
      <div className={styles.detailsSection}>
        { rows }
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
          {this.renderDetails() }
        </div>
        <div className={styles.exploreSection}>
          { this.renderExplorer() }
        </div>
      </div>
    );
  }
}

export default SourceView;

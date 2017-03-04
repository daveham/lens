import { connect } from 'react-redux';
import { makeStatsId } from '@lens/image-descriptors';
import { sourceStatsDescriptorSelector } from './selectors';
import { ensureStats } from 'routes/Catalog/modules/catalog/stats/actions';

import SourceView from '../components/SourceView.js';

import debugLib from 'debug';
const debug = debugLib('app:module:source-container');

const mapDispatchToProps = {
  ensureStats
};

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.params;
  const catalogLoaded = !state.catalog.loading && state.sources.ids.length > 0;
  const sourceStatsDescriptor = sourceStatsDescriptorSelector(state, id);
  const statsId = makeStatsId(sourceStatsDescriptor);
  let stats;
  if (catalogLoaded) {
    const byIds = state.stats.byIds['sources'];
    if (byIds) {
      stats = byIds[statsId].data;
    }
  }
  debug('mapStateToProps', { stats });

  return {
    id,
    catalogLoaded,
    sourceStatsDescriptor,
    stats
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SourceView);

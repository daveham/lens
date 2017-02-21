import { connect } from 'react-redux';
import { makeSourceStatsDescriptor, makeSourceImageDescriptor } from '@lens/image-descriptors';

import { ensureStats } from 'routes/Catalog/modules/stats/actions';

import SourceView from '../components/SourceView.js';

const mapDispatchToProps = {
  ensureStats
};

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.params;
  const catalogLoaded = !state.catalog.loading && state.catalog.sources.length > 0;
  const sourceStatsDescriptor = makeSourceStatsDescriptor(makeSourceImageDescriptor(id));
  let stats;
  if (catalogLoaded) stats = state.stats[sourceStatsDescriptor];
  return {
    id,
    catalogLoaded,
    sourceStatsDescriptor,
    stats
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SourceView);

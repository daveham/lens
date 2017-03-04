import { connect } from 'react-redux';
import { sourceStatsDescriptorsSelector } from './selectors';
import { ensureStats } from 'routes/Catalog/modules/catalog/stats/actions';

import SourceView from '../components/SourceView.js';

const mapDispatchToProps = {
  ensureStats
};

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.params;
  const catalogLoaded = !state.catalog.loading && state.sources.ids.length > 0;
  const sourceStatsDescriptor = sourceStatsDescriptorsSelector(state, id);
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

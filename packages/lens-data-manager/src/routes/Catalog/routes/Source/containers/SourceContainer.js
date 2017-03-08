import { connect } from 'react-redux';
import { makeStatsKey } from '@lens/image-descriptors';
import { sourceStatsDescriptorSelector, thumbnailUrlFromIdSelector } from 'routes/Catalog/modules/catalog/selectors';
import { ensureStats } from 'routes/Catalog/modules/catalog/stats/actions';

import SourceView from '../components/SourceView.js';

const mapDispatchToProps = {
  ensureStats
};

const selectStats = ({ stats }, key) => {
  const byKeys = stats.byKeys['sources'];
  if (byKeys) {
    const statsItem = byKeys[key];
    if (statsItem) {
      return statsItem.data;
    }
  }
};

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.params;
  const sourceStatsDescriptor = sourceStatsDescriptorSelector(state, id);
  const statsKey = makeStatsKey(sourceStatsDescriptor);
  const thumbnailImageUrl = thumbnailUrlFromIdSelector(state, id);

  return {
    id,
    catalogLoaded: !state.catalog.loading && state.sources.ids.length > 0,
    sourceStatsDescriptor,
    thumbnailImageUrl,
    stats: selectStats(state, statsKey)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SourceView);

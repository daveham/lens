import { connect } from 'react-redux';
import { makeStatsKey } from '@lens/image-descriptors';
import {
  thumbnailUrlFromIdSelector,
  sourceStatsDescriptorSelector,
  statsByKeySelector
} from 'routes/Catalog/modules/catalog/selectors';
import { ensureStats } from 'routes/Catalog/modules/catalog/stats/actions';

import SourceView from '../components/SourceView.js';

const mapDispatchToProps = {
  ensureStats
};

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.params;
  const sourceStatsDescriptor = sourceStatsDescriptorSelector(state, id);
  const thumbnailImageUrl = thumbnailUrlFromIdSelector(state, id);
  const stats = statsByKeySelector(state, makeStatsKey(sourceStatsDescriptor));

  return {
    id,
    catalogLoaded: !state.catalog.loading && state.sources.ids.length > 0,
    sourceStatsDescriptor,
    thumbnailImageUrl,
    stats
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SourceView);

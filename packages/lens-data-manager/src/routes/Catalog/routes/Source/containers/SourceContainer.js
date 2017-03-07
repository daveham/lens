import { connect } from 'react-redux';
import { makeStatsKey, makeImageKey, makeThumbnailImageDescriptor } from '@lens/image-descriptors';
import { sourceStatsDescriptorSelector } from './selectors';
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

const THUMBNAIL_IMAGE_LOADING_URL = '/thumbloading.png';
const THUMBNAILS_LIST_KEY = 'thumbnails';

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.params;
  const sourceStatsDescriptor = sourceStatsDescriptorSelector(state, id);
  const statsKey = makeStatsKey(sourceStatsDescriptor);
  const imageDescriptor = makeThumbnailImageDescriptor(id);
  const imageKey = makeImageKey(imageDescriptor);
  const thumbnailByKeys = state.images.byKeys[THUMBNAILS_LIST_KEY] || {};
  const image = thumbnailByKeys[imageKey];
  const thumbnailImageUrl = (image && !image.loading) ? image.url : THUMBNAIL_IMAGE_LOADING_URL;

  return {
    id,
    catalogLoaded: !state.catalog.loading && state.sources.ids.length > 0,
    sourceStatsDescriptor,
    thumbnailImageUrl,
    stats: selectStats(state, statsKey)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SourceView);

import { connect } from 'react-redux';
import {
  makeSourceImageDescriptor,
  makeSourceStatsDescriptor,
  makeThumbnailImageDescriptor
} from '@lens/image-descriptors';
import {
  thumbnailUrlFromIdSelector,
  tileImagesSelector
} from 'modules/images/selectors';
import {
  statsSelector,
  tileStatsSelector
} from 'modules/stats/selectors';
import { ensureCatalogTitle } from '../../modules/actions';
import { ensureStats, deleteStats } from 'modules/stats/actions';
import { ensureImage, ensureImages } from 'modules/images/actions';
import { SourceView as View, displayTileResolution } from './view';

// import _debug from 'debug';
// const debug = _debug('lens:sourceView:index');

const mapDispatchToProps = {
  ensureStats,
  deleteStats,
  ensureImage,
  ensureImages,
  ensureCatalogTitle,
};

const mapStateToProps = (state, { match: { params: { id, res } } }) => {
  let resolution = parseInt(res, 10);
  if (!(resolution === 8 || resolution === 16 || resolution === 32)) {
    resolution = 32;
  }

  const sourceStatsDescriptor = makeSourceStatsDescriptor(makeSourceImageDescriptor(id));
  const statsItem = statsSelector(state, sourceStatsDescriptor);
  const sourceStats = statsItem ? statsItem.data : undefined;
  const thumbnailImageDescriptor = makeThumbnailImageDescriptor(id);
  const thumbnailUrl = thumbnailUrlFromIdSelector(state, id);
  const displayImages = tileImagesSelector(state, id, displayTileResolution);
  const tileStats = tileStatsSelector(state, id, resolution);

  return {
    sourceId: id,
    resolution,
    sourceStatsDescriptor,
    sourceStats,
    displayImages,
    tileStats,
    thumbnailImageDescriptor,
    thumbnailUrl,
  };
};

export const SourceView = connect(mapStateToProps, mapDispatchToProps)(View);

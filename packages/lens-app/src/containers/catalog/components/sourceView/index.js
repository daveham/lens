import { connect } from 'react-redux';
import {
  makeSourceImageDescriptor,
  makeSourceStatsDescriptor,
  makeThumbnailImageDescriptor
} from '@lens/image-descriptors';
import {
  thumbnailUrlFromIdSelector,
  tileImagesSelector
} from '../../../../modules/images/selectors';
import { statsSelector } from '../../../../modules/stats/selectors';
import { ensureStats } from '../../../../modules/stats/actions';
import { ensureImage, ensureImages } from '../../../../modules/images/actions';
import View from './view';

const mapDispatchToProps = {
  ensureStats,
  ensureImage,
  ensureImages
};

const mapStateToProps = (state, ownProps) => {
  const { id, res } = ownProps.match.params;
  let resolution = parseInt(res, 10);
  if (!(resolution === 8 || resolution === 16 || resolution === 32 || resolution === 64)) {
    resolution = 32;
  }

  const sourceStatsDescriptor = makeSourceStatsDescriptor(makeSourceImageDescriptor(id));
  const sourceStats = statsSelector(state, sourceStatsDescriptor);
  const thumbnailImageDescriptor = makeThumbnailImageDescriptor(id);
  const thumbnailUrl = thumbnailUrlFromIdSelector(state, id);
  const tileImages = tileImagesSelector(state, id, resolution);

  return {
    sourceId: id,
    resolution,
    sourceStatsDescriptor,
    sourceStats,
    tileImages,
    thumbnailImageDescriptor,
    thumbnailUrl,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(View);

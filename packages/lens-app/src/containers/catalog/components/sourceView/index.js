import { connect } from 'react-redux';
import {
  makeSourceImageDescriptor,
  makeSourceStatsDescriptor,
  makeThumbnailImageDescriptor
} from '@lens/image-descriptors';
import { thumbnailUrlFromIdSelector } from '../../../../modules/images/selectors';
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
  const { id } = ownProps.match.params;
  const sourceStatsDescriptor = makeSourceStatsDescriptor(makeSourceImageDescriptor(id));
  const sourceStats = statsSelector(state, sourceStatsDescriptor);
  const thumbnailImageDescriptor = makeThumbnailImageDescriptor(id);
  const thumbnailUrl = thumbnailUrlFromIdSelector(state, id);

  return {
    sourceId: id,
    sourceStatsDescriptor,
    sourceStats,
    thumbnailImageDescriptor,
    thumbnailUrl,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(View);

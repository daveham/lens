import { connect } from 'react-redux';
import {
  makeSourceImageDescriptor,
  makeSourceStatsDescriptor
} from '@lens/image-descriptors';
import { thumbnailUrlFromIdSelector } from '../../../../modules/images/selectors';
import { statsSelector } from '../../../../modules/stats/selectors';
import { ensureStats } from '../../../../modules/stats/actions';
import { ensureImages } from '../../../../modules/images/actions';
import View from './view';

const mapDispatchToProps = {
  ensureStats,
  ensureImages
};

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  const sourceStatsDescriptor = makeSourceStatsDescriptor(makeSourceImageDescriptor(id));
  const sourceThumbnailUrl = thumbnailUrlFromIdSelector(state, id);
  const sourceStats = statsSelector(state, sourceStatsDescriptor);

  return {
    sourceId: id,
    sourceStatsDescriptor,
    sourceThumbnailUrl,
    sourceStats
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(View);

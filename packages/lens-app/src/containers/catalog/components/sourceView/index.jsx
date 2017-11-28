import { connect } from 'react-redux';
import { thumbnailUrlFromIdSelector } from '../../../../modules/images/selectors';
import {
  sourceStatsDescriptorSelector,
  statsSelector
} from '../../../../modules/stats/selectors';
import { ensureStats } from '../../../../modules/stats/actions';
import View from './view';

const mapDispatchToProps = { ensureStats };

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  const sourceStatsDescriptor = sourceStatsDescriptorSelector(state, id);
  const sourceThumbnailUrl = thumbnailUrlFromIdSelector(state, id);
  const sourceStats = statsSelector(state, sourceStatsDescriptor);

  return {
    sourceStatsDescriptor,
    sourceThumbnailUrl,
    sourceStats
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(View);

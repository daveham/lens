import { connect } from 'react-redux';
import {
  makeSourceImageDescriptor,
  makeSourceStatsDescriptor
} from '@lens/image-descriptors';
import { thumbnailUrlsSelector } from '../../../../modules/images/selectors';
import { statsSelector } from '../../../../modules/stats/selectors';
import { ensureStats } from '../../../../modules/stats/actions';
import { sourcesArray } from '../../selectors';
import View from './view';

const mapDispatchToProps = { ensureStats };

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;

  const sources = sourcesArray(state);
  const index = sources.findIndex((source) => source.id === id);

  const thumbnailImageUrls = thumbnailUrlsSelector(state);
  const sourceThumbnailUrl = thumbnailImageUrls[index];

  const imageDescriptor = makeSourceImageDescriptor(id);
  imageDescriptor.input.file = sources[index].file;
  const sourceStatsDescriptor = makeSourceStatsDescriptor(imageDescriptor);
  const sourceStats = statsSelector(state, sourceStatsDescriptor);

  return {
    sourceThumbnailUrl,
    sourceStatsDescriptor,
    sourceStats
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(View);

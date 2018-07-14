import { connect } from 'react-redux';
import { makeThumbnailImageDescriptor } from '@lens/image-descriptors';
import { thumbnailUrlFromIdSelector } from '../../../modules/images/selectors';
import { ensureImage } from '../../../modules/images/actions';

// import _debug from 'debug';
// const debug = _debug('lens:simulation:execution:rdxWrapper');

const mapDispatchToProps = { ensureImage };

const mapStateToProps = (state, { match: { params: { sourceId, simulationId } }}) => {
  const thumbnailImageDescriptor = makeThumbnailImageDescriptor(sourceId);
  const thumbnailUrl = thumbnailUrlFromIdSelector(state, sourceId);

  return {
    sourceId,
    simulationId,
    thumbnailImageDescriptor,
    thumbnailUrl
  };
};

export default connect(mapStateToProps, mapDispatchToProps);

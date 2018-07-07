import { connect } from 'react-redux';
import { makeThumbnailImageDescriptor } from '@lens/image-descriptors';
import { thumbnailUrlFromIdSelector } from '../../../modules/images/selectors';
import { ensureImage } from '../../../modules/images/actions';

// import _debug from 'debug';
// const debug = _debug('lens:simulation:rendering:rdxWrapper');

const mapDispatchToProps = { ensureImage };

const mapStateToProps = (state, { match: { params: { id, simulationId, executionId } }}) => {
  const thumbnailImageDescriptor = makeThumbnailImageDescriptor(id);
  const thumbnailUrl = thumbnailUrlFromIdSelector(state, id);

  return {
    sourceId: id,
    simulationId,
    executionId,
    thumbnailImageDescriptor,
    thumbnailUrl
  };
};

export default connect(mapStateToProps, mapDispatchToProps);

import { connect } from 'react-redux';
import { makeThumbnailImageDescriptor } from '@lens/image-descriptors';
import { thumbnailUrlFromIdSelector } from 'modules/images/selectors';
import { ensureImage } from 'modules/images/actions';

// import _debug from 'debug';
// const debug = _debug('lens:simulation:view:rdxWrapper');

const mapDispatchToProps = { ensureImage };

const mapStateToProps = (state, { match: { params: { sourceId } } }) => {
  const thumbnailImageDescriptor = makeThumbnailImageDescriptor(sourceId);
  const thumbnailUrl = thumbnailUrlFromIdSelector(state, sourceId);

  return {
    sourceId,
    thumbnailImageDescriptor,
    thumbnailUrl
  };
};

export default connect(mapStateToProps, mapDispatchToProps);

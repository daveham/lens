import { connect } from 'react-redux';
import { makeThumbnailImageDescriptor } from '@lens/image-descriptors';
import { thumbnailUrlFromIdSelector } from 'modules/images/selectors';
import { ensureImage } from 'modules/images/actions';
import { photoSelector } from 'src/modules/ui';
import { ensureEditorTitle } from '../modules/actions';

// import _debug from 'debug';
// const debug = _debug('lens:editor:common:editorRdxWrapper');

const mapDispatchToProps = {
  ensureImage,
  ensureEditorTitle,
};

const mapStateToProps = (state, { match: { params: { sourceId } } }) => {
  const thumbnailImageDescriptor = makeThumbnailImageDescriptor(sourceId);
  const thumbnailUrl = thumbnailUrlFromIdSelector(state, sourceId);
  const photo = photoSelector(state);

  return {
    photo,
    thumbnailImageDescriptor,
    thumbnailUrl
  };
};

export default connect(mapStateToProps, mapDispatchToProps);

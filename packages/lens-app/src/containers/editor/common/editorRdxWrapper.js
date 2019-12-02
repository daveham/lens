import { connect } from 'react-redux';
import { makeThumbnailImageDescriptor } from '@lens/image-descriptors';
import { thumbnailUrlFromIdSelector } from 'modules/images/selectors';
import { ensureImage } from 'modules/images/actions';
import { photoSelector } from 'src/modules/ui';
import {
  ensureEditorTitle,
  setActiveScope,
} from '../modules/actions/ui';
import {
  requestSimulationsForSource,
} from '../modules/actions/data';
import {
  simulationsSelector,
  simulationsLoadingSelector,
  actionValidSelector,
} from '../modules/selectors';

// import _debug from 'debug';
// const debug = _debug('lens:editor:common:editorRdxWrapper');

const mapDispatchToProps = {
  ensureImage,
  ensureEditorTitle,
  requestSimulationsForSource,
  setActiveScope,
};

const mapStateToProps = (state, { match: { params: { sourceId } } }) => {
  const thumbnailImageDescriptor = makeThumbnailImageDescriptor(sourceId);
  const thumbnailUrl = thumbnailUrlFromIdSelector(state, sourceId);
  const photo = photoSelector(state);
  const simulations = simulationsSelector(state);
  const simulationsLoading = simulationsLoadingSelector(state);
  const actionValid = actionValidSelector(state);

  return {
    photo,
    thumbnailImageDescriptor,
    thumbnailUrl,
    simulations,
    simulationsLoading,
    actionEnabled: actionValid && !simulationsLoading,
    actionValid,
  };
};

export default connect(mapStateToProps, mapDispatchToProps);

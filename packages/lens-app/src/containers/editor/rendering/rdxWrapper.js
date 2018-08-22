import { connect } from 'react-redux';
import { makeThumbnailImageDescriptor } from '@lens/image-descriptors';
import { thumbnailUrlFromIdSelector } from 'modules/images/selectors';
import { ensureImage } from 'modules/images/actions';
import { recordPathNames } from '../modules/actions';
import {
  simulationNamesSelector,
  executionNamesSelector
} from '../modules/selectors';

// import _debug from 'debug';
// const debug = _debug('lens:simulation:rendering:rdxWrapper');

const mapDispatchToProps = {
  ensureImage,
  recordPathNames
};

const mapStateToProps = (state, { match: { params: { sourceId, simulationId, executionId } } }) => {
  const thumbnailImageDescriptor = makeThumbnailImageDescriptor(sourceId);
  const thumbnailUrl = thumbnailUrlFromIdSelector(state, sourceId);
  const simulationNames = simulationNamesSelector(state);
  const executionNames = executionNamesSelector(state);

  return {
    sourceId,
    simulationId,
    executionId,
    simulationNames,
    executionNames,
    thumbnailImageDescriptor,
    thumbnailUrl
  };
};

export default connect(mapStateToProps, mapDispatchToProps);

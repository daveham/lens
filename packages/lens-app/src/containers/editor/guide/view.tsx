import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { makeThumbnailImageDescriptor } from '@lens/image-descriptors';

import { photoSelector } from 'src/modules/ui';
import { thumbnailUrlFromIdSelector } from 'modules/images/selectors';
import {
  simulationsSelector,
  simulationsLoadingSelector,
  actionEnabledSelector,
  // actionValidSelector,
  activeSelector,
} from 'editor/modules/selectors';

import { ensureImage } from 'modules/images/actions';
import {
  ensureEditorTitle,
  requestSimulationsForSource,
  setActiveScope,
} from 'editor/modules/actions';

import GuideControl, { controlSegmentKeys, controlSegmentActions } from './components/guideControl';

import _debug from 'debug';
const debug = _debug('lens:editor:guide:view');

interface IProps {
  match: any;
  history: any;
}

const EditorGuideView = (props: IProps) => {
  const {
    history,
    match: {
      params: {
        sourceId,
        simulationId,
        executionId,
        renderingId,
        action,
      },
    },
  } = props;

  const thumbnailUrl = useSelector(state => thumbnailUrlFromIdSelector(state, sourceId));
  const photo = useSelector(photoSelector);
  const simulations = useSelector(simulationsSelector);
  const simulationsLoading = useSelector(simulationsLoadingSelector);
  // const actionValid = useSelector(actionValidSelector);
  const active = useSelector(activeSelector);
  const actionEnabled = useSelector(actionEnabledSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    if (sourceId) {
      debug('useEffect', { sourceId });
      dispatch(ensureEditorTitle(sourceId));
      dispatch(ensureImage({ imageDescriptor: makeThumbnailImageDescriptor(sourceId) }));
      dispatch(requestSimulationsForSource(sourceId));
    }
  }, [dispatch, sourceId]);

  const handleControlActionSubmit = () => {
    debug('handleControlActionSubmit');
  };

  const handleControlActionCancel = () => {
    debug('handleControlActionCancel');
  };

  const handleControlParametersChanged = (params, nextActive, action) => {
    const { simulationId, executionId, renderingId } = params;
    debug('handleControlParametersChanged', {
      nextActive,
      simulationId,
      executionId,
      renderingId,
    });

    const isNewAction = action === controlSegmentActions.new;
    let path = `/Catalog/${sourceId}/Simulation`;
    let id;

    switch (nextActive) {
      case controlSegmentKeys.simulation:
        id = simulationId;
        break;
      case controlSegmentKeys.execution:
        path = `${path}/${simulationId}/Execution`;
        id = executionId;
        break;
      case controlSegmentKeys.rendering:
        path = `${path}/${simulationId}/Execution/${executionId}/Rendering`;
        id = renderingId;
        break;
      default:
        return;
    }

    if (isNewAction) {
      path = `${path}/${controlSegmentActions.new}`;
    } else if (id) {
      path = `${path}/${id}`;
    }

    if (nextActive !== active) {
      debug('handleControlParametersChange - set active scope', { nextActive });
      dispatch(setActiveScope(nextActive));
    }

    if (action && !isNewAction) {
      path = `${path}/${action}`;
    }

    if (path !== history.location.pathname) {
      debug('handleControlParametersChange - navigate', {
        fromPath: history.location.pathname,
        toPath: path
      });
      history.push(path);
    }
  };

  let resolvedSimulationId = simulationId;
  let resolvedExecutionId = executionId;
  let resolvedRenderingId = renderingId;
  let resolvedAction = action;
  const re = /^[a-z]+$/;
  debug('render', { simulationId, executionId, renderingId });
  if (renderingId && re.test(renderingId)) {
    resolvedAction = renderingId; // interpret id as rest action and clear id
    resolvedRenderingId = undefined;
  } else if (executionId && re.test(executionId)) {
    resolvedAction = executionId; // interpret id as rest action and clear id
    resolvedExecutionId = undefined;
  } else if (simulationId && re.test(simulationId)) {
    resolvedAction = simulationId; // interpret id as rest action and clear id
    resolvedSimulationId = undefined;
  }

  return (
    <GuideControl
      loading={simulationsLoading}
      title={photo}
      thumbnailUrl={thumbnailUrl}
      simulations={simulations}
      sourceId={sourceId}
      simulationId={resolvedSimulationId}
      executionId={resolvedExecutionId}
      renderingId={resolvedRenderingId}
      action={resolvedAction}
      submitEnabled={actionEnabled}
      onControlParametersChanged={handleControlParametersChanged}
      onControlActionSubmit={handleControlActionSubmit}
      onControlActionCancel={handleControlActionCancel}
    />
  );
};

export default EditorGuideView;

import React, { useEffect, useCallback } from 'react';
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
        simulationId = '',
        executionId = '',
        renderingId = '',
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
      debug('useEffect to fetch initial data', { sourceId });
      dispatch(ensureEditorTitle(sourceId));
      dispatch(ensureImage({ imageDescriptor: makeThumbnailImageDescriptor(sourceId) }));
      dispatch(requestSimulationsForSource(sourceId));
    }
  }, [dispatch, sourceId]);

  const handleControlActionSubmit = useCallback(() => {
    debug('handleControlActionSubmit');
  }, []);

  const handleControlActionCancel = useCallback(() => {
    debug('handleControlActionCancel');
  }, []);

  const handleControlParametersChanged = useCallback((params, nextActive, action) => {
    const {
      simulationId: changedSimulationId,
      executionId: changedExecutionId,
      renderingId: changedRenderingId,
    } = params;
    debug('handleControlParametersChanged', {
      nextActive,
      changedSimulationId,
      changedExecutionId,
      changedRenderingId,
    });

    const isNewAction = action === controlSegmentActions.new;
    let path = `/Catalog/${sourceId}/Simulation`;
    let id;

    switch (nextActive) {
      case controlSegmentKeys.simulation:
        id = changedSimulationId;
        break;
      case controlSegmentKeys.execution:
        path = `${path}/${changedSimulationId}/Execution`;
        id = changedExecutionId;
        break;
      case controlSegmentKeys.rendering:
        path = `${path}/${changedSimulationId}/Execution/${changedExecutionId}/Rendering`;
        id = changedRenderingId;
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

    const currentPath = history.location.pathname;
    debug('handleControlParametersChange', { currentPath });
    if (path !== currentPath) {
      debug('handleControlParametersChange - navigate', {
        toPath: path
      });
      history.push(path);
    }
  }, [sourceId, active, history, dispatch]);

  // render
  debug('render', { simulationId, executionId, renderingId });
  let resolvedSimulationId = simulationId;
  let resolvedExecutionId = executionId;
  let resolvedRenderingId = renderingId;
  let resolvedAction = action;
  const re = /^[a-z]+$/;
  if (renderingId && re.test(renderingId)) {
    resolvedAction = renderingId; // interpret id as rest action and clear id
    resolvedRenderingId = '';
  } else if (executionId && re.test(executionId)) {
    resolvedAction = executionId; // interpret id as rest action and clear id
    resolvedExecutionId = '';
  } else if (simulationId && re.test(simulationId)) {
    resolvedAction = simulationId; // interpret id as rest action and clear id
    resolvedSimulationId = '';
  }
  debug('render', { resolvedSimulationId, resolvedExecutionId, resolvedRenderingId });

  return (
    <GuideControl
      loading={simulationsLoading}
      title={photo}
      thumbnailUrl={thumbnailUrl}
      simulations={simulations}
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

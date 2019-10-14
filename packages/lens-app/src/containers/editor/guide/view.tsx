import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { makeThumbnailImageDescriptor } from '@lens/image-descriptors';

import { photoSelector } from 'src/modules/ui';
import { thumbnailUrlFromIdSelector } from 'modules/images/selectors';
import {
  simulationsSelector,
  simulationsLoadingSelector,
  actionValidSelector,
} from 'editor/modules/selectors';

import { ensureImage } from 'modules/images/actions';
import {
  ensureEditorTitle,
  requestSimulationsForSource,
} from 'editor/modules/actions';
import { reduxActionForFinishOperation, reduxActionForCancelOperation } from './utils';

import GuideControl from './components/guideControl';
import { controlSegmentKeys, controlSegmentActions } from './components/guideConstants';

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
      params: { sourceId, simulationId = '', executionId = '', renderingId = '', action = '' },
    },
  } = props;

  const thumbnailUrl = useSelector(state => thumbnailUrlFromIdSelector(state, sourceId));
  const photo = useSelector(photoSelector);
  const simulations = useSelector(simulationsSelector);
  const simulationsLoading = useSelector(simulationsLoadingSelector);
  const actionValid = useSelector(actionValidSelector);

  const dispatch = useDispatch();

  const determineItems = () => {
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

    let simulation;
    let execution;
    let rendering;

    const isNewAction = resolvedAction === controlSegmentActions.new;

    if (simulations) {
      if (!(isNewAction && !resolvedSimulationId)) {
        simulation = simulations.find(s => s.id === resolvedSimulationId) || simulations[0];
        if (simulation) {
          if (!(isNewAction && !resolvedExecutionId)) {
            const { executions } = simulation;
            if (executions) {
              execution = executions.find(e => e.id === resolvedExecutionId) || executions[0];
              if (execution) {
                if (!(isNewAction && !resolvedRenderingId)) {
                  const { renderings } = execution;
                  if (renderings) {
                    rendering = renderings.find(r => r.id === resolvedRenderingId) || renderings[0];
                  }
                }
              }
            }
          }
        }
      }
    }

    // determine active item based on Id's present in the URL
    let activeItem: string = '';
    if (resolvedRenderingId || (resolvedAction && resolvedExecutionId && isNewAction)) {
      activeItem = controlSegmentKeys.rendering;
    } else if (resolvedExecutionId || (resolvedAction && resolvedSimulationId && isNewAction)) {
      activeItem = controlSegmentKeys.execution;
    } else if (resolvedSimulationId || (resolvedAction && isNewAction)) {
      activeItem = controlSegmentKeys.simulation;
    } else {
      activeItem = controlSegmentKeys.simulation;
    }

    return {
      activeItem,
      simulation,
      execution,
      rendering,
      resolvedAction,
    };
  };

  const { activeItem, simulation, execution, rendering, resolvedAction } = determineItems();

  useEffect(() => {
    if (sourceId) {
      dispatch(ensureEditorTitle(sourceId));
      dispatch(ensureImage({ imageDescriptor: makeThumbnailImageDescriptor(sourceId) }));
      dispatch(requestSimulationsForSource(sourceId));
    }
  }, [dispatch, sourceId]);

  useEffect(() => {
    const currentPath = history.location.pathname;
    if (currentPath.toLowerCase().endsWith(controlSegmentKeys.simulation) && simulations.length) {
      history.push(`/Catalog/${sourceId}/Simulation/${simulations[0].id}`);
    }
  }, [history, sourceId, simulations]);

  const handleControlActionSubmit = useCallback(() => {
    debug('handleControlActionSubmit', { activeItem, resolvedAction });
    dispatch(reduxActionForFinishOperation(activeItem, resolvedAction));
  }, [dispatch, activeItem, resolvedAction]);

  const handleControlActionCancel = useCallback(() => {
    debug('handleControlActionCancel', { activeItem, resolvedAction });
    dispatch(reduxActionForCancelOperation(activeItem, resolvedAction));
  }, [dispatch, activeItem, resolvedAction]);

  const handleControlChanged = useCallback(
    path => {
      const currentPath = history.location.pathname;
      const nextPath = `/Catalog/${sourceId}/${path}`;
      if (nextPath !== currentPath) {
        // debug('handleControlChanged', { currentPath, nextPath });
        history.push(nextPath);
      }
    },
    [sourceId, history],
  );

  // render
  return (
    <GuideControl
      loading={simulationsLoading}
      title={photo}
      thumbnailUrl={thumbnailUrl}
      simulations={simulations}
      activeItem={activeItem}
      simulation={simulation}
      execution={execution}
      rendering={rendering}
      action={resolvedAction}
      submitEnabled={actionValid}
      onControlChanged={handleControlChanged}
      onControlActionSubmit={handleControlActionSubmit}
      onControlActionCancel={handleControlActionCancel}
    />
  );
};

export default EditorGuideView;

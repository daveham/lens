import React, { useEffect, useCallback, useState } from 'react';
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
import { ensureEditorTitle } from 'editor/modules/actions/ui';
import { requestSimulationsForSource } from 'editor/modules/actions/data';
import { reduxActionForStartOperation } from 'editor/guide/utils';

import GuideControl from './components/guideControl';
import { controlSegmentKeys, controlSegmentActions } from './components/guideConstants';

import getDebugLog from './debugLog';
const debug = getDebugLog('view');

interface IProps {
  match: any;
  history: any;
}

const resolveIdsAndAction = (simulationId, executionId, renderingId, action) => {
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
  return {
    resolvedSimulationId,
    resolvedExecutionId,
    resolvedRenderingId,
    resolvedAction,
  };
};

const determineActiveItemKey = (simulationId, executionId, renderingId, action) => {
  // determine active item based on Id's present in the URL
  const isNewAction = action === controlSegmentActions.new;
  if (renderingId || (executionId && isNewAction)) {
    return controlSegmentKeys.rendering;
  } else if (executionId || (simulationId && isNewAction)) {
    return controlSegmentKeys.execution;
  }
  return controlSegmentKeys.simulation;
};

const determineActiveItems = (simulations, simulationId, executionId, renderingId, action) => {
  let simulation;
  let execution;
  let rendering;
  if (simulations) {
    const isNewAction = action === controlSegmentActions.new;
    if (!(isNewAction && !simulationId)) {
      simulation = simulations.find(s => s.id === simulationId) || simulations[0];
      if (simulation) {
        if (!(isNewAction && !executionId)) {
          const { executions } = simulation;
          if (executions) {
            execution = executions.find(e => e.id === executionId) || executions[0];
            if (execution) {
              if (!(isNewAction && !renderingId)) {
                const { renderings } = execution;
                if (renderings) {
                  rendering = renderings.find(r => r.id === renderingId) || renderings[0];
                }
              }
            }
          }
        }
      }
    }
  }
  return { simulation, execution, rendering };
};

const determineItems = (simulations, simulationId, executionId, renderingId, action) => {
  const {
    resolvedSimulationId,
    resolvedExecutionId,
    resolvedRenderingId,
    resolvedAction,
  } = resolveIdsAndAction(simulationId, executionId, renderingId, action);

  return {
    activeItem: determineActiveItemKey(
      resolvedSimulationId,
      resolvedExecutionId,
      resolvedRenderingId,
      resolvedAction,
    ),
    resolvedSimulationId,
    resolvedExecutionId,
    resolvedRenderingId,
    ...determineActiveItems(
      simulations,
      resolvedSimulationId,
      resolvedExecutionId,
      resolvedRenderingId,
      resolvedAction,
    ),
    resolvedAction,
  };
};

const EditorGuideView = ({
  history,
  match: {
    params: { sourceId, simulationId = '', executionId = '', renderingId = '', action = '' },
  },
}: IProps) => {
  const [pathname, setPathname] = useState('');

  const thumbnailUrl = useSelector(state => thumbnailUrlFromIdSelector(state, sourceId));
  const photo = useSelector(photoSelector);
  const simulations = useSelector(simulationsSelector);
  const simulationsLoading = useSelector(simulationsLoadingSelector);
  const actionValid = useSelector(actionValidSelector);

  const dispatch = useDispatch();

  const {
    activeItem,
    resolvedSimulationId,
    resolvedExecutionId,
    resolvedRenderingId,
    simulation,
    execution,
    rendering,
    resolvedAction,
  } = determineItems(simulations, simulationId, executionId, renderingId, action);

  // check if time to dispatch start of operation
  useEffect(() => {
    const startAction = resolvedAction || controlSegmentActions.view;
    const isNewAction = startAction === controlSegmentActions.new;
    if (isNewAction || (simulations && simulations.length)) {
      setPathname(prev => {
        const nextPathname = history.location.pathname.toLowerCase();
        if (prev !== nextPathname) {
          if (activeItem && (resolvedSimulationId || isNewAction)) {
            let parameters;
            if (activeItem === controlSegmentKeys.execution) {
              parameters = { simulationId: resolvedSimulationId, executionId: resolvedExecutionId };
            } else if (activeItem === controlSegmentKeys.rendering) {
              parameters = {
                simulationId: resolvedSimulationId,
                executionId: resolvedExecutionId,
                renderingId: resolvedRenderingId,
              };
            } else {
              parameters = { sourceId, simulationId: resolvedSimulationId };
            }
            dispatch(reduxActionForStartOperation(activeItem, startAction, parameters));
          }
        }
        return nextPathname;
      });
    }
  }, [
    simulations,
    history.location.pathname,
    dispatch,
    sourceId,
    activeItem,
    resolvedSimulationId,
    resolvedExecutionId,
    resolvedRenderingId,
    resolvedAction,
  ]);

  // get initial data for title, image and simulations
  useEffect(() => {
    if (sourceId) {
      dispatch(ensureEditorTitle(sourceId));
      dispatch(
        ensureImage({
          imageDescriptor: makeThumbnailImageDescriptor(sourceId),
        }),
      );
      dispatch(requestSimulationsForSource({ sourceId }));
    }
  }, [dispatch, sourceId]);

  // move to first simulation if path ends with '/simulation
  useEffect(() => {
    if (pathname.endsWith(controlSegmentKeys.simulation) && simulations.length) {
      debug('useEffect(history) - extending to specific simulation', { pathname });
      history.push(`/Catalog/${sourceId}/Simulation/${simulations[0].id}`);
    }
  }, [history, pathname, sourceId, simulations]);

  const handleControlChanged = useCallback(
    path => {
      const currentPath = history.location.pathname;
      const nextPath = `/Catalog/${sourceId}/${path}`;
      debug('handleControlChanged', {
        currentPath,
        nextPath,
      });
      if (nextPath !== currentPath) {
        history.push(nextPath);
      }
    },
    [sourceId, history],
  );

  debug('render', { simulations: [...simulations] });

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
    />
  );
};

export default EditorGuideView;

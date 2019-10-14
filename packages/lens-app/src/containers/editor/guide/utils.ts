import { controlSegmentActions, controlSegmentKeys } from 'editor/guide/components/guideConstants';
import {
  startViewSimulation,
  startViewExecution,
  startViewRendering,
  startNewSimulation,
  startEditSimulation,
  startDeleteSimulation,
  startNewExecution,
  startEditExecution,
  startDeleteExecution,
  startNewRendering,
  startEditRendering,
  startDeleteRendering,
  finishNewSimulation,
  finishEditSimulation,
  finishDeleteSimulation,
  finishNewExecution,
  finishEditExecution,
  finishDeleteExecution,
  finishNewRendering,
  finishEditRendering,
  finishDeleteRendering,
  cancelNewSimulation,
  cancelEditSimulation,
  cancelDeleteSimulation,
  cancelNewExecution,
  cancelEditExecution,
  cancelDeleteExecution,
  cancelNewRendering,
  cancelEditRendering,
  cancelDeleteRendering,
} from 'editor/modules/actions';

const viewMap = {
  [controlSegmentKeys.simulation]: startViewSimulation,
  [controlSegmentKeys.execution]: startViewExecution,
  [controlSegmentKeys.rendering]: startViewRendering,
};

export function reduxActionForViewOperation(segmentKey, ...actionArgs) {
  return viewMap[segmentKey](...actionArgs);
}

const newMap = {
  [controlSegmentKeys.simulation]: {
    [controlSegmentActions.new]: startNewSimulation,
    [controlSegmentActions.edit]: startEditSimulation,
    [controlSegmentActions.delete]: startDeleteSimulation,
  },
  [controlSegmentKeys.execution]: {
    [controlSegmentActions.new]: startNewExecution,
    [controlSegmentActions.edit]: startEditExecution,
    [controlSegmentActions.delete]: startDeleteExecution,
  },
  [controlSegmentKeys.rendering]: {
    [controlSegmentActions.new]: startNewRendering,
    [controlSegmentActions.edit]: startEditRendering,
    [controlSegmentActions.delete]: startDeleteRendering,
  },
};

export function reduxActionForStartOperation(segmentKey, segmentAction, ...actionArgs) {
  return newMap[segmentKey][segmentAction](...actionArgs);
}

const submitMap = {
  [controlSegmentKeys.simulation]: {
    [controlSegmentActions.new]: finishNewSimulation,
    [controlSegmentActions.edit]: finishEditSimulation,
    [controlSegmentActions.delete]: finishDeleteSimulation,
  },
  [controlSegmentKeys.execution]: {
    [controlSegmentActions.new]: finishNewExecution,
    [controlSegmentActions.edit]: finishEditExecution,
    [controlSegmentActions.delete]: finishDeleteExecution,
  },
  [controlSegmentKeys.rendering]: {
    [controlSegmentActions.new]: finishNewRendering,
    [controlSegmentActions.edit]: finishEditRendering,
    [controlSegmentActions.delete]: finishDeleteRendering,
  },
};

export function reduxActionForFinishOperation(segmentKey, segmentAction, ...actionArgs) {
  return submitMap[segmentKey][segmentAction](...actionArgs);
}

const cancelMap = {
  [controlSegmentKeys.simulation]: {
    [controlSegmentActions.new]: cancelNewSimulation,
    [controlSegmentActions.edit]: cancelEditSimulation,
    [controlSegmentActions.delete]: cancelDeleteSimulation,
  },
  [controlSegmentKeys.execution]: {
    [controlSegmentActions.new]: cancelNewExecution,
    [controlSegmentActions.edit]: cancelEditExecution,
    [controlSegmentActions.delete]: cancelDeleteExecution,
  },
  [controlSegmentKeys.rendering]: {
    [controlSegmentActions.new]: cancelNewRendering,
    [controlSegmentActions.edit]: cancelEditRendering,
    [controlSegmentActions.delete]: cancelDeleteRendering,
  },
};

export function reduxActionForCancelOperation(segmentKey, segmentAction, ...actionArgs) {
  return cancelMap[segmentKey][segmentAction](...actionArgs);
}

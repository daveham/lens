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
  startRunExecution,
  // cancelRunExecution,
  startRenderRendering,
  // cancelRenderRendering,
} from 'editor/modules/actions/operations';

const startMap = {
  [controlSegmentKeys.simulation]: {
    [controlSegmentActions.view]: startViewSimulation,
    [controlSegmentActions.new]: startNewSimulation,
    [controlSegmentActions.edit]: startEditSimulation,
    [controlSegmentActions.delete]: startDeleteSimulation,
  },
  [controlSegmentKeys.execution]: {
    [controlSegmentActions.view]: startViewExecution,
    [controlSegmentActions.new]: startNewExecution,
    [controlSegmentActions.edit]: startEditExecution,
    [controlSegmentActions.delete]: startDeleteExecution,
    [controlSegmentActions.run]: startRunExecution,
  },
  [controlSegmentKeys.rendering]: {
    [controlSegmentActions.view]: startViewRendering,
    [controlSegmentActions.new]: startNewRendering,
    [controlSegmentActions.edit]: startEditRendering,
    [controlSegmentActions.delete]: startDeleteRendering,
    [controlSegmentActions.render]: startRenderRendering,
  },
};

export function reduxActionForStartOperation(segmentKey, segmentAction, ...actionArgs) {
  return startMap[segmentKey][segmentAction](...actionArgs);
}

const finishMap = {
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
  return finishMap[segmentKey][segmentAction](...actionArgs);
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

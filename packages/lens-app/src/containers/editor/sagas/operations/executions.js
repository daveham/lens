import { all, delay, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects';
import { defaultNewExecution } from 'editor/interfaces';
import {
  simulationByIdSelector,
  executionByIdSelector,
  selectedSimulationSelector,
  selectedExecutionSelector,
  executionValid,
} from 'editor/modules/selectors';
import {
  // execution operations actions
  // - view
  startViewExecution,
  viewExecutionStarted,
  // - new
  startNewExecution,
  newExecutionStarted,
  finishNewExecution,
  newExecutionFinished,
  cancelNewExecution,
  newExecutionCanceled,
  // - edit
  startEditExecution,
  editExecutionStarted,
  finishEditExecution,
  editExecutionFinished,
  cancelEditExecution,
  editExecutionCanceled,
  startRunExecution,
  runExecutionStarted,
  // - delete
  startDeleteExecution,
  deleteExecutionStarted,
  finishDeleteExecution,
  deleteExecutionFinished,
  cancelDeleteExecution,
  deleteExecutionCanceled,
} from 'editor/modules/actions/operations';
import {
  setSelectedExecution,
  editorActionValid,
  setSnackbarMessage,
  setSnackbarErrorMessage,
} from 'editor/modules/actions/ui';

import {
  // execution data actions
  // - save (update)
  saveExecution,
  saveExecutionSucceeded,
  saveExecutionFailed,
  // - save new (insert)
  saveNewExecution,
  saveNewExecutionSucceeded,
  saveNewExecutionFailed,
  // - delete
  deleteExecution,
  deleteExecutionSucceeded,
  deleteExecutionFailed,
} from 'editor/modules/actions/data';

import _debug from 'debug';
const debug = _debug('lens:editor:sagas:operations:executions');

function* validateExecutionSaga() {
  const isValid = yield select(executionValid);
  yield put(editorActionValid(isValid));
}

const startMap = {
  [startViewExecution]: viewExecutionStarted,
  [startEditExecution]: editExecutionStarted,
  [startDeleteExecution]: deleteExecutionStarted,
};

// same saga for starting new, edit, delete execution operations
export function* startExecutionOperationSaga({ type, payload: { simulationId, executionId } }) {
  const { execution, simulation } = yield select(executionByIdSelector, simulationId, executionId);
  if (execution && execution.simulationId === simulationId) {
    yield put(setSelectedExecution({ execution, simulation }));
    yield* validateExecutionSaga();
    const startAction = startMap[type];
    yield put(startAction({ simulationId, executionId }));
  } else {
    yield put(setSelectedExecution({}));
  }
}

export function* finishEditExecutionSaga({ payload: { simulationId, executionId } }) {
  debug('finishEditExecutionSaga', { simulationId, executionId });
  const changedExecution = yield select(selectedExecutionSelector);
  const { execution: originalExecution } = yield select(
    executionByIdSelector,
    simulationId,
    executionId,
  );
  if (!originalExecution || originalExecution.id !== changedExecution.id) {
    debug('finishEditExecutionSaga - changed execution id not the expected id');
    yield put(setSnackbarErrorMessage('Save Execution failed - mismatched id'));
  } else {
    const { simulation } = yield select(simulationByIdSelector, simulationId);
    const { sourceId } = simulation;
    let errorOccurred = false;

    // gather all of the possible changes
    const changes = {};
    if (changedExecution.name !== originalExecution.name) {
      changes.name = changedExecution.name;
    }
    if (Object.keys(changes).length > 0) {
      const [, result] = yield all([
        put(saveExecution({ executionId, simulationId, sourceId, changes })),
        take([saveExecutionSucceeded, saveExecutionFailed]),
      ]);

      if (result.type === `${saveExecutionFailed}`) {
        errorOccurred = true;
        yield put(setSnackbarErrorMessage(`Save Execution failed: ${result.payload}`));
      }
    }
    if (!errorOccurred) {
      yield put(setSnackbarMessage(`Execution '${changes.name || originalExecution.name}' saved.`));
    }
  }
  yield delay(0);
  yield put(editExecutionFinished());
}

export function* finishDeleteExecutionSaga({ payload: { simulationId, executionId } }) {
  debug('finishDeleteExecutionSaga', { simulationId, executionId });

  const { execution } = yield select(executionByIdSelector, simulationId, executionId);
  const { simulation } = yield select(simulationByIdSelector, simulationId);
  const { sourceId } = simulation;

  const [, result] = yield all([
    put(deleteExecution({ sourceId, simulationId, executionId })),
    take([deleteExecutionSucceeded, deleteExecutionFailed]),
  ]);

  if (result.type === `${deleteExecutionSucceeded}`) {
    yield put(setSnackbarMessage(`Execution '${execution.name}' deleted.`));
  } else {
    yield put(setSnackbarErrorMessage(`Delete Execution failed: ${result.payload}`));
  }

  yield delay(0);
  yield put(deleteExecutionFinished());
}

export function* startNewExecutionSaga({ payload: { simulationId } }) {
  debug('startNewExecutionSaga', { simulationId });
  const { simulation } = yield select(simulationByIdSelector, simulationId);
  const execution = defaultNewExecution(simulationId, { isNew: true });
  yield put(setSelectedExecution({ simulation, execution }));
  yield* validateExecutionSaga();
  yield put(newExecutionStarted());
}

export function* startRunExecutionSaga({ payload: { simulationId, executionId} }) {
  debug('startRunExecutionSaga', { simulationId, executionId });

  yield put(runExecutionStarted({ simulationId, executionId }));
}

export function* finishNewExecutionSaga() {
  const simulation = yield select(selectedSimulationSelector);
  const execution = yield select(selectedExecutionSelector);
  const [, result] = yield all([
    put(saveNewExecution({ sourceId: simulation.sourceId, execution })),
    take([saveNewExecutionSucceeded, saveNewExecutionFailed]),
  ]);

  if (result.type === `${saveNewExecutionSucceeded}`) {
    yield put(setSnackbarMessage('New Execution saved.'));
  } else {
    yield put(setSnackbarErrorMessage(`Saving new Execution failed: ${result.payload}`));
  }

  yield delay(0);
  yield put(newExecutionFinished());
}

export function* cancelEditExecutionSaga() {
  yield delay(0);
  yield put(editExecutionCanceled());
}

export function* cancelDeleteExecutionSaga() {
  yield delay(0);
  yield put(deleteExecutionCanceled());
}

export function* cancelNewExecutionSaga() {
  yield delay(0);
  yield put(newExecutionCanceled());
}

export default function* operationsExecutionsSaga() {
  yield all([
    takeLatest(
      [startViewExecution, startEditExecution, startDeleteExecution],
      startExecutionOperationSaga,
    ),
    takeEvery(startNewExecution, startNewExecutionSaga),
    takeEvery(finishNewExecution, finishNewExecutionSaga),
    takeEvery(cancelNewExecution, cancelNewExecutionSaga),
    takeEvery(finishEditExecution, finishEditExecutionSaga),
    takeEvery(cancelEditExecution, cancelEditExecutionSaga),
    takeEvery(finishDeleteExecution, finishDeleteExecutionSaga),
    takeEvery(cancelDeleteExecution, cancelDeleteExecutionSaga),
    takeEvery(startRunExecution, startRunExecutionSaga),
  ]);
}

import { all, delay, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects';
import { defaultNewExecution } from 'editor/interfaces';
import {
  simulationByIdSelector,
  executionByIdSelector,
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
  // - delete
  startDeleteExecution,
  deleteExecutionStarted,
  finishDeleteExecution,
  deleteExecutionFinished,
  cancelDeleteExecution,
  deleteExecutionCanceled,
} from 'editor/modules/actions/operations';
import { setSelectedExecution, editorActionValid } from 'editor/modules/actions/ui';

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

const animationDelay = 350;

function* validateExecutionSaga() {
  const isValid = yield select(executionValid);
  yield put(editorActionValid(isValid));
}

// same saga for starting new, edit, delete execution operations
export function* startExecutionOperationSaga({ type, payload: { simulationId, executionId } }) {
  yield delay(animationDelay);
  const execution = yield select(executionByIdSelector, simulationId, executionId);
  yield put(setSelectedExecution(execution));
  yield* validateExecutionSaga();
  if (type === `${startViewExecution}`) {
    yield put(viewExecutionStarted({ simulationId, executionId }));
  } else if (type === `${startEditExecution}`) {
    yield put(editExecutionStarted({ simulationId, executionId }));
  } else {
    yield put(deleteExecutionStarted({ simulationId, executionId }));
  }
}

export function* finishEditExecutionSaga({ payload: { simulationId, executionId } }) {
  debug('finishEditExecutionSaga', { simulationId, executionId });
  const changedExecution = yield select(selectedExecutionSelector);
  const originalExecution = yield select(executionByIdSelector, simulationId, executionId);
  if (!originalExecution || originalExecution.id !== changedExecution.id) {
    debug('finishEditExecutionSaga - changed execution id not the expected id');
  } else {
    const changes = {};
    const { sourceId } = originalExecution;
    if (changedExecution.name !== originalExecution.name) {
      changes.name = changedExecution.name;
    }
    if (Object.keys(changes).length > 0) {
      yield put(saveExecution({ executionId, simulationId, sourceId, changes }));
      yield take([saveExecutionSucceeded, saveExecutionFailed]);
    }
  }
  yield delay(0);
  yield put(editExecutionFinished());
}

export function* finishDeleteExecutionSaga({ payload: { simulationId, executionId } }) {
  debug('finishDeleteExecutionSaga', { simulationId });

  const simulation = yield select(simulationByIdSelector, simulationId);
  const { sourceId } = simulation;

  yield put(deleteExecution({ sourceId, simulationId, executionId }));
  yield take([deleteExecutionSucceeded, deleteExecutionFailed]);

  yield delay(animationDelay);
  yield put(deleteExecutionFinished());
}

export function* startNewExecutionSaga({ payload: { simulationId } }) {
  debug('startNewExecutionSaga', { simulationId });
  const execution = defaultNewExecution(simulationId, { isNew: true });
  yield put(setSelectedExecution(execution));
  yield* validateExecutionSaga();
  yield put(newExecutionStarted());
}

export function* finishNewExecutionSaga() {
  const execution = yield select(selectedExecutionSelector);
  yield put(saveNewExecution({ execution }));
  yield take([saveNewExecutionSucceeded, saveNewExecutionFailed]);
  yield delay(animationDelay);
  yield put(newExecutionFinished());
}

export function* cancelEditExecutionSaga() {
  yield delay(animationDelay);
  yield put(editExecutionCanceled());
}

export function* cancelDeleteExecutionSaga() {
  yield delay(animationDelay);
  yield put(deleteExecutionCanceled());
}

export function* cancelNewExecutionSaga() {
  yield delay(animationDelay);
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
  ]);
}

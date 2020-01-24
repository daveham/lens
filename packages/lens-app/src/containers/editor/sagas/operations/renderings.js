import { all, delay, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects';
import { defaultNewRendering } from 'editor/interfaces';
import {
  simulationByIdSelector,
  renderingByIdSelector,
  selectedRenderingSelector,
  renderingValid,
  executionByIdSelector,
  selectedSimulationSelector,
} from 'editor/modules/selectors';
import {
  // execution operations actions
  // - view
  startViewRendering,
  viewRenderingStarted,
  // - new
  startNewRendering,
  newRenderingStarted,
  finishNewRendering,
  newRenderingFinished,
  cancelNewRendering,
  newRenderingCanceled,
  // - edit
  startEditRendering,
  editRenderingStarted,
  finishEditRendering,
  editRenderingFinished,
  cancelEditRendering,
  editRenderingCanceled,
  // - delete
  startDeleteRendering,
  deleteRenderingStarted,
  finishDeleteRendering,
  deleteRenderingFinished,
  cancelDeleteRendering,
  deleteRenderingCanceled,
} from 'editor/modules/actions/operations';
import {
  setSelectedRendering,
  editorActionValid,
  setSnackbarMessage,
  setSnackbarErrorMessage,
} from 'editor/modules/actions/ui';

import {
  // execution data actions
  // - save (update)
  saveRendering,
  saveRenderingSucceeded,
  saveRenderingFailed,
  // - save new (insert)
  saveNewRendering,
  saveNewRenderingSucceeded,
  saveNewRenderingFailed,
  // - delete
  deleteRendering,
  deleteRenderingSucceeded,
  deleteRenderingFailed,
} from 'editor/modules/actions/data';

import _debug from 'debug';
const debug = _debug('lens:editor:sagas:operations:renderings');

function* validateRenderingSaga() {
  const isValid = yield select(renderingValid);
  yield put(editorActionValid(isValid));
}

const startMap = {
  [startViewRendering]: viewRenderingStarted,
  [startEditRendering]: editRenderingStarted,
  [startDeleteRendering]: deleteRenderingStarted,
};

// same saga for starting new, edit, delete rendering operations
export function* startRenderingOperationSaga({
  type,
  payload: { simulationId, executionId, renderingId },
}) {
  const { rendering, execution, simulation } = yield select(
    renderingByIdSelector,
    simulationId,
    executionId,
    renderingId,
  );
  if (rendering && rendering.executionId === executionId) {
    yield put(setSelectedRendering({ simulation, execution, rendering }));
    yield* validateRenderingSaga();
    const startAction = startMap[type];
    yield put(startAction({ simulationId, executionId, renderingId }));
  } else {
    yield put(setSelectedRendering({}));
  }
}

export function* finishEditRenderingSaga({ payload: { simulationId, executionId, renderingId } }) {
  debug('finishEditRenderingSaga', { simulationId, executionId });
  const changedRendering = yield select(selectedRenderingSelector);
  const { rendering: originalRendering } = yield select(
    renderingByIdSelector,
    simulationId,
    executionId,
    renderingId,
  );
  if (!originalRendering || originalRendering.id !== changedRendering.id) {
    debug('finishEditRenderingSaga - changed rendering id not the expected id');
    yield put(setSnackbarErrorMessage('Save Rendering failed - mismatched id'));
  } else {
    const { simulation } = yield select(simulationByIdSelector, simulationId);
    const { sourceId } = simulation;
    let errorOccurred = false;

    // gather all of the possible changes
    const changes = {};
    if (changedRendering.name !== originalRendering.name) {
      changes.name = changedRendering.name;
    }
    if (Object.keys(changes).length > 0) {
      const [, result] = yield all([
        put(saveRendering({ renderingId, executionId, simulationId, sourceId, changes })),
        take([saveRenderingSucceeded, saveRenderingFailed]),
      ]);

      if (result.type === `${saveRenderingFailed}`) {
        errorOccurred = true;
        yield put(setSnackbarErrorMessage(`Save Rendering failed: ${result.payload}`));
      }
    }
    if (!errorOccurred) {
      yield put(setSnackbarMessage(`Rendering '${changes.name || originalRendering.name}' saved.`));
    }
  }
  yield delay(0);
  yield put(editRenderingFinished());
}

export function* finishDeleteRenderingSaga({ payload: { renderingId } }) {
  debug('finishDeleteRenderingSaga', { renderingId });

  const rendering = yield select(selectedRenderingSelector);
  const { simulationId, executionId } = rendering;
  const { simulation } = yield select(simulationByIdSelector, simulationId);
  const { sourceId } = simulation;

  const [, result] = yield all([
    put(deleteRendering({ sourceId, simulationId, executionId, renderingId })),
    take([deleteRenderingSucceeded, deleteRenderingFailed]),
  ]);

  if (result.type === `${deleteRenderingSucceeded}`) {
    yield put(setSnackbarMessage(`Rendering '${rendering.name}' deleted.`));
  } else {
    yield put(setSnackbarErrorMessage(`Delete Rendering failed: ${result.payload}`));
  }

  yield delay(0);
  yield put(deleteRenderingFinished());
}

export function* startNewRenderingSaga({ payload: { simulationId, executionId } }) {
  debug('startNewRenderingSaga', { simulationId, executionId });
  const { execution, simulation } = yield select(executionByIdSelector, simulationId, executionId);
  const rendering = defaultNewRendering(simulationId, executionId, { isNew: true });
  yield put(setSelectedRendering({ simulation, execution, rendering }));
  yield* validateRenderingSaga();
  yield put(newRenderingStarted());
}

export function* finishNewRenderingSaga() {
  const simulation = yield select(selectedSimulationSelector);
  const rendering = yield select(selectedRenderingSelector);
  const [, result] = yield all([
    put(
      saveNewRendering({
        sourceId: simulation.sourceId,
        rendering,
      }),
    ),
    take([saveNewRenderingSucceeded, saveNewRenderingFailed]),
  ]);

  if (result.type === `${saveNewRenderingSucceeded}`) {
    yield put(setSnackbarMessage('New Rendering saved.'));
  } else {
    yield put(setSnackbarErrorMessage(`Saving new Rendering failed: ${result.payload}`));
  }

  yield delay(0);
  yield put(newRenderingFinished());
}

export function* cancelEditRenderingSaga() {
  yield delay(0);
  yield put(editRenderingCanceled());
}

export function* cancelDeleteRenderingSaga() {
  yield delay(0);
  yield put(deleteRenderingCanceled());
}

export function* cancelNewRenderingSaga() {
  yield delay(0);
  yield put(newRenderingCanceled());
}

export default function* operationsRenderingsSaga() {
  yield all([
    takeLatest(
      [startViewRendering, startEditRendering, startDeleteRendering],
      startRenderingOperationSaga,
    ),
    takeEvery(startNewRendering, startNewRenderingSaga),
    takeEvery(finishNewRendering, finishNewRenderingSaga),
    takeEvery(cancelNewRendering, cancelNewRenderingSaga),
    takeEvery(finishEditRendering, finishEditRenderingSaga),
    takeEvery(cancelEditRendering, cancelEditRenderingSaga),
    takeEvery(finishDeleteRendering, finishDeleteRenderingSaga),
    takeEvery(cancelDeleteRendering, cancelDeleteRenderingSaga),
  ]);
}

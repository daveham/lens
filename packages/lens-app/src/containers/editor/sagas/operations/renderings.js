import { all, delay, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects';
import { defaultNewRendering } from 'editor/interfaces';
import {
  simulationByIdSelector,
  renderingByIdSelector,
  selectedRenderingSelector,
  renderingValid,
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
import { setSelectedRendering, editorActionValid } from 'editor/modules/actions/ui';

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

// same saga for starting new, edit, delete rendering operations
export function* startRenderingOperationSaga({
  type,
  payload: { simulationId, executionId, renderingId },
}) {
  const rendering = yield select(renderingByIdSelector, simulationId, executionId, renderingId);
  if (rendering && rendering.executionId === executionId) {
    yield put(setSelectedRendering(rendering));
    yield* validateRenderingSaga();
    if (type === `${startViewRendering}`) {
      yield put(viewRenderingStarted({ simulationId, executionId, renderingId }));
    } else if (type === `${startEditRendering}`) {
      yield put(editRenderingStarted({ simulationId, executionId, renderingId }));
    } else {
      yield put(deleteRenderingStarted({ simulationId, executionId, renderingId }));
    }
  } else {
    yield put(setSelectedRendering());
  }
}

export function* finishEditRenderingSaga({ payload: { simulationId, executionId, renderingId } }) {
  debug('finishEditRenderingSaga', { simulationId, executionId });
  const changedRendering = yield select(selectedRenderingSelector);
  const originalRendering = yield select(
    renderingByIdSelector,
    simulationId,
    executionId,
    renderingId,
  );
  if (!originalRendering || originalRendering.id !== changedRendering.id) {
    debug('finishEditRenderingSaga - changed rendering id not the expected id');
  } else {
    const changes = {};
    const simulation = yield select(simulationByIdSelector, simulationId);
    const { sourceId } = simulation;
    if (changedRendering.name !== originalRendering.name) {
      changes.name = changedRendering.name;
    }
    if (Object.keys(changes).length > 0) {
      yield put(saveRendering({ renderingId, executionId, simulationId, sourceId, changes }));
      yield take([saveRenderingSucceeded, saveRenderingFailed]);
    }
  }
  yield delay(0);
  yield put(editRenderingFinished());
}

export function* finishDeleteRenderingSaga({ payload: { renderingId } }) {
  debug('finishDeleteRenderingSaga', { renderingId });

  const rendering = yield select(selectedRenderingSelector);
  const { simulationId, executionId } = rendering;
  const simulation = yield select(simulationByIdSelector, simulationId);
  const { sourceId } = simulation;

  yield put(deleteRendering({ sourceId, simulationId, executionId, renderingId }));
  yield take([deleteRenderingSucceeded, deleteRenderingFailed]);

  yield delay(0);
  yield put(deleteRenderingFinished());
}

export function* startNewRenderingSaga({ payload: { simulationId, executionId } }) {
  debug('startNewRenderingSaga', { simulationId, executionId });
  const rendering = defaultNewRendering(simulationId, executionId, { isNew: true });
  yield put(setSelectedRendering(rendering));
  yield* validateRenderingSaga();
  yield put(newRenderingStarted());
}

export function* finishNewRenderingSaga() {
  const rendering = yield select(selectedRenderingSelector);
  const simulation = yield select(simulationByIdSelector, rendering.simulationId);
  debug('finishNewRenderingSaga', { simulation, rendering });
  yield put(
    saveNewRendering({
      sourceId: simulation.sourceId,
      rendering,
    }),
  );
  yield take([saveNewRenderingSucceeded, saveNewRenderingFailed]);
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

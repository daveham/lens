import { all, delay, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects';
import { defaultNewSimulation } from 'editor/interfaces';
import {
  // requestSimulationsForSource,
  // receiveSimulationsForSource,
  // requestSimulationsForSourceFailed,
  setSelectedSimulation,
  editorActionValid,
  requestHikes,
  receiveHikes,
  requestHikesFailed,
  startViewSimulation,
  viewSimulationStarted,
  startNewSimulation,
  newSimulationStarted,
  finishNewSimulation,
  newSimulationFinished,
  cancelNewSimulation,
  newSimulationCanceled,
  startEditSimulation,
  editSimulationStarted,
  finishEditSimulation,
  editSimulationFinished,
  cancelEditSimulation,
  editSimulationCanceled,
  startDeleteSimulation,
  deleteSimulationStarted,
  finishDeleteSimulation,
  deleteSimulationFinished,
  cancelDeleteSimulation,
  deleteSimulationCanceled,
  saveSimulation,
  saveSimulationSucceeded,
  saveSimulationFailed,
  saveNewSimulation,
  saveNewSimulationSucceeded,
  saveNewSimulationFailed,
  deleteSimulation,
  deleteSimulationSucceeded,
  deleteSimulationFailed,
  saveHikes,
  saveHikesSucceeded,
  saveHikesFailed,
} from 'editor/modules/actions';
import {
  selectedSimulationSelector,
  simulationAndDataValid,
  simulationByIdSelector,
  simulationsSelector,
  hikesSelector,
} from 'editor/modules/selectors';

import _debug from 'debug';
const debug = _debug('lens:editor:sagas:operations');

function* validateSimulationSaga() {
  const isValid = yield select(simulationAndDataValid);
  yield put(editorActionValid(isValid));
}

// same saga for starting new, edit, delete operations
export function* startSimulationOperationSaga({ type, payload: { simulationId } }) {
  const simulations = yield select(simulationsSelector);
  const simulation = simulations.find(simulation => simulation.id === simulationId);
  yield put(setSelectedSimulation(simulation));
  yield put(requestHikes({ simulationId }));
  const result = yield take([receiveHikes, requestHikesFailed]);
  if (result.type === `${receiveHikes}`) {
    yield* validateSimulationSaga();
  } // else error - what to do?
  if (type === `${startViewSimulation}`) {
    yield put(viewSimulationStarted({ simulationId }));
  } else if (type === `${startEditSimulation}`) {
    yield put(editSimulationStarted({ simulationId }));
  } else {
    yield put(deleteSimulationStarted({ simulationId }));
  }
}

export function* finishEditSimulationSaga({ payload: { simulationId } }) {
  debug('finishEditSimulationSaga', { simulationId });
  const changedSimulation = yield select(selectedSimulationSelector);
  const originalSimulation = yield select(simulationByIdSelector, simulationId);
  if (!originalSimulation || originalSimulation.id !== changedSimulation.id) {
    debug('finishEditSimulationSaga - changed simulation id not the expected id');
  } else {
    const changes = {};
    const { sourceId } = originalSimulation;
    if (changedSimulation.name !== originalSimulation.name) {
      changes.name = changedSimulation.name;
    }
    if (Object.keys(changes).length > 0) {
      yield put(saveSimulation({ simulationId, sourceId, changes }));
      yield take([saveSimulationSucceeded, saveSimulationFailed]);
    }
    const hikes = yield select(hikesSelector);
    yield put(saveHikes({ simulationId, hikes }));
    yield take([saveHikesSucceeded, saveHikesFailed]);
  }
  yield delay(0);
  yield put(editSimulationFinished());
}

export function* finishDeleteSimulationSaga({ payload: { simulationId }}) {
  debug('finishDeleteSimulationSaga', { simulationId });

  const simulation = yield select(simulationByIdSelector, simulationId);
  const { sourceId } = simulation;

  yield put(deleteSimulation({ sourceId, simulationId }));
  yield take([deleteSimulationSucceeded, deleteSimulationFailed]);

  yield delay(0);
  yield put(deleteSimulationFinished());
}

export function* startNewSimulationSaga({ payload: { sourceId } }) {
  debug('startNewSimulationSaga', { sourceId });
  const simulation = defaultNewSimulation(sourceId, { isNew: true });
  yield put(setSelectedSimulation(simulation));
  yield put(receiveHikes());
  yield* validateSimulationSaga();
  yield put(newSimulationStarted());
}

export function* finishNewSimulationSaga() {
  const simulation = yield select(selectedSimulationSelector);
  yield put(saveNewSimulation({ simulation }));
  const result = yield take([saveNewSimulationSucceeded, saveNewSimulationFailed]);
  if (result.type === `${saveNewSimulationSucceeded}`) {
    const hikes = yield select(hikesSelector);
    yield put(saveHikes({ simulationId: result.payload.id, hikes }));
    yield take([saveHikesSucceeded, saveHikesFailed]);
  }
  yield delay(0);
  yield put(newSimulationFinished());
}

export function* cancelEditSimulationSaga() {
  yield delay(0);
  yield put(editSimulationCanceled());
}

export function* cancelDeleteSimulationSaga() {
  yield delay(0);
  yield put(deleteSimulationCanceled());
}

export function* cancelNewSimulationSaga() {
  yield delay(0);
  yield put(newSimulationCanceled());
}

export default function* operationsRootSaga() {
  yield all([
    takeLatest(
      [startViewSimulation, startEditSimulation, startDeleteSimulation],
      startSimulationOperationSaga,
    ),
    takeLatest(startNewSimulation, startNewSimulationSaga),
    takeEvery(finishNewSimulation, finishNewSimulationSaga),
    takeEvery(cancelNewSimulation, cancelNewSimulationSaga),
    takeEvery(finishEditSimulation, finishEditSimulationSaga),
    takeEvery(cancelEditSimulation, cancelEditSimulationSaga),
    takeEvery(finishDeleteSimulation, finishDeleteSimulationSaga),
    takeEvery(cancelDeleteSimulation, cancelDeleteSimulationSaga),
  ]);
}

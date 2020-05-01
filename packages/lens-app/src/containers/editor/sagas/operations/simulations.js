import { all, delay, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects';
import { defaultNewSimulation } from 'editor/interfaces';
import {
  selectedSimulationSelector,
  simulationAndDataValid,
  simulationByIdSelector,
  hikesSelector,
} from 'editor/modules/selectors';
import {
  // simulation operations actions
  // - view
  startViewSimulation,
  viewSimulationStarted,
  // - new
  startNewSimulation,
  newSimulationStarted,
  finishNewSimulation,
  newSimulationFinished,
  cancelNewSimulation,
  newSimulationCanceled,
  // - edit
  startEditSimulation,
  editSimulationStarted,
  finishEditSimulation,
  editSimulationFinished,
  cancelEditSimulation,
  editSimulationCanceled,
  // - delete
  startDeleteSimulation,
  deleteSimulationStarted,
  finishDeleteSimulation,
  deleteSimulationFinished,
  cancelDeleteSimulation,
  deleteSimulationCanceled,
} from 'editor/modules/actions/operations';
import {
  setSelectedSimulation,
  editorActionValid,
  setSnackbarMessage,
  setSnackbarErrorMessage,
} from 'editor/modules/actions/ui';
import {
  requestHikes,
  receiveHikes,
  requestHikesFailed,
  // simulation data actions
  // - save (update)
  saveSimulation,
  saveSimulationSucceeded,
  saveSimulationFailed,
  // - save new (insert)
  saveNewSimulation,
  saveNewSimulationSucceeded,
  saveNewSimulationFailed,
  // - delete
  deleteSimulation,
  deleteSimulationSucceeded,
  deleteSimulationFailed,
  // - save hikes
  saveHikes,
  saveHikesSucceeded,
  saveHikesFailed,
} from 'editor/modules/actions/data';

import getDebugLog from './debugLog';
const debug = getDebugLog('simulations');

function* validateSimulationSaga() {
  const isValid = yield select(simulationAndDataValid);
  yield put(editorActionValid(isValid));
}

const startMap = {
  [startViewSimulation]: viewSimulationStarted,
  [startEditSimulation]: editSimulationStarted,
  [startDeleteSimulation]: deleteSimulationStarted,
};

// same saga for starting new, edit, delete simulation operations
export function* startSimulationOperationSaga({ type, payload: { sourceId, simulationId } }) {
  const { simulation } = yield select(simulationByIdSelector, simulationId);
  if (simulation && simulation.sourceId === sourceId) {
    yield put(setSelectedSimulation({ simulation }));

    const [, result] = yield all([
      put(requestHikes({ simulationId, sourceId: simulation.sourceId })),
      take([receiveHikes, requestHikesFailed]),
    ]);

    if (result.type === `${receiveHikes}`) {
      yield* validateSimulationSaga();
      const startAction = startMap[type];
      yield put(startAction({ simulationId }));
    } else {
      yield put(setSnackbarErrorMessage(`An error occurred reading hikes: ${result.payload}`));
    }
  } else {
    yield put(setSelectedSimulation());
  }
}

export function* finishEditSimulationSaga({ payload: { simulationId } }) {
  debug('finishEditSimulationSaga', { simulationId });
  const changedSimulation = yield select(selectedSimulationSelector);
  const { simulation: originalSimulation } = yield select(simulationByIdSelector, simulationId);
  if (!originalSimulation || originalSimulation.id !== changedSimulation.id) {
    debug('finishEditSimulationSaga - changed simulation id not the expected id');
    yield put(setSnackbarErrorMessage('Save Simulation failed - mismatched id'));
  } else {
    const { sourceId } = originalSimulation;
    let errorOccurred = false;

    // gather all of the possible changes
    const changes = {};
    if (changedSimulation.name !== originalSimulation.name) {
      changes.name = changedSimulation.name;
    }
    if (Object.keys(changes).length > 0) {
      const [, result] = yield all([
        put(saveSimulation({ simulationId, sourceId, changes })),
        take([saveSimulationSucceeded, saveSimulationFailed]),
      ]);

      if (result.type === `${saveSimulationFailed}`) {
        errorOccurred = true;
        yield put(setSnackbarErrorMessage(`Save Simulation failed: ${result.payload}`));
      }
    }
    if (!errorOccurred) {
      const hikes = yield select(hikesSelector);
      const [, saveHikesResult] = yield all([
        put(saveHikes({ sourceId, simulationId, hikes })),
        take([saveHikesSucceeded, saveHikesFailed]),
      ]);

      if (saveHikesResult.type === `${saveHikesFailed}`) {
        errorOccurred = true;
        yield put(setSnackbarErrorMessage(`Save Simulation Hikes failed: ${saveHikesResult.payload}`));
      }
    }
    if (!errorOccurred) {
      yield put(setSnackbarMessage(`Simulation '${changes.name || originalSimulation.name}' saved.`))
    }
  }
  yield delay(0);
  yield put(editSimulationFinished());
}

export function* finishDeleteSimulationSaga({ payload: { simulationId } }) {
  debug('finishDeleteSimulationSaga', { simulationId });

  const { simulation } = yield select(simulationByIdSelector, simulationId);
  const { sourceId } = simulation;

  const [, result] = yield all([
    put(deleteSimulation({ sourceId, simulationId })),
    take([deleteSimulationSucceeded, deleteSimulationFailed]),
  ]);

  if (result.type === `${deleteSimulationSucceeded}`) {
    yield put(setSnackbarMessage(`Simulation '${simulation.name}' deleted.`));
  } else {
    yield put(setSnackbarErrorMessage(`Delete Simulation failed: ${result.payload}`));
  }

  yield put(deleteSimulationFinished());
}

export function* startNewSimulationSaga({ payload: { sourceId } }) {
  debug('startNewSimulationSaga', { sourceId });
  const simulation = defaultNewSimulation(sourceId, { isNew: true });
  yield put(setSelectedSimulation({ simulation }));
  yield put(receiveHikes());
  yield* validateSimulationSaga();
  yield put(newSimulationStarted());
}

export function* finishNewSimulationSaga() {
  const simulation = yield select(selectedSimulationSelector);
  const [, result] = yield all([
    put(saveNewSimulation({ simulation })),
    take([saveNewSimulationSucceeded, saveNewSimulationFailed]),
  ]);
  if (result.type === `${saveNewSimulationSucceeded}`) {
    const hikes = yield select(hikesSelector);
    const newSimulation = result.payload;
    const [, saveHikesResult] = yield all([
      put(saveHikes({ sourceId: newSimulation.sourceId, simulationId: newSimulation.id, hikes })),
      take([saveHikesSucceeded, saveHikesFailed]),
    ]);
    if (saveHikesResult.type === `${saveHikesSucceeded}`) {
      yield put(setSnackbarMessage('New Simulation saved.'));
    } else {
      yield put(setSnackbarErrorMessage(`Saving hikes for new Simulation failed: ${saveHikesResult.payload}`));
    }
  } else {
    yield put(setSnackbarErrorMessage(`Saving new Simulation failed: ${result.payload}`));
  }
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

export default function* operationsSimulationsSaga() {
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

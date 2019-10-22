import { all, put, takeEvery } from '@redux-saga/core/effects';
import {
  requestHikes,
  receiveHikes,
  requestSimulationsForSource,
  receiveSimulationsForSource,
  saveSimulation,
  saveSimulationSucceeded,
  // saveSimulationFailed,
  saveNewSimulation,
  saveNewSimulationSucceeded,
  // saveNewSimulationFailed,
  saveHikes,
  saveHikesSucceeded,
  // saveHikesFailed,
} from 'editor/modules/actions';
import { generateMockHikesData, generateMockSimulationsData } from 'editor/sagas/mockData';

import _debug from 'debug';
const debug = _debug('lens:editor:dataSagas');

const mockSimulationsData = {};

export function* readSimulationsForSourceSaga({ payload: { sourceId } }) {
  debug('readSimulationsForSourceSaga', { sourceId });

  let mockSimulations = mockSimulationsData[sourceId];
  if (!mockSimulations) {
    mockSimulations = generateMockSimulationsData(sourceId);
    mockSimulationsData[sourceId] = mockSimulations;
  }
  yield put(receiveSimulationsForSource(mockSimulations));

  // yield* apiSaga(invokeRestService,
  //   [ `/simulations/${payload}` ],
  //   receiveSimulationsForSource,
  //   requestSimulationsForSourceFailed);
}

const mockHikesData = {};

export function* readHikesSaga({ payload: { simulationId } }) {
  debug('readHikesSaga', { simulationId });

  let mockHikes = mockHikesData[simulationId];
  if (!mockHikes) {
    mockHikes = generateMockHikesData(simulationId);
    mockHikesData[simulationId] = mockHikes;
  }
  yield put(receiveHikes(mockHikes));
}

export function* saveSimulationSaga({ payload: { simulationId, sourceId, changes } }) {
  debug('saveSimulationSaga', { simulationId, sourceId, changes });

  const modified = Date.now();
  const simulations = mockSimulationsData[sourceId];
  const simulation = simulations.find(s => s.id === simulationId);

  const changedSimulation = {
    ...simulation,
    ...changes,
    modified,
  };
  mockSimulationsData[sourceId] = simulations.map(s =>
    s.id === simulationId ? changedSimulation : s,
  );

  yield put(saveSimulationSucceeded(changedSimulation));
}

export function* saveNewSimulationSaga({ payload: { simulation }}) {
  debug('saveNewSimulationSaga', { simulation });

  const created = Date.now();
  const { isNew, trails, sourceId, ...props } = simulation;
  const newSimulation = {
    ...props,
    sourceId,
    created,
    modified: created,
    executions: [],
  };
  const simulations = mockSimulationsData[sourceId] || [];
  mockSimulationsData[sourceId] = [
    ...simulations,
    newSimulation,
  ];

  yield put(saveNewSimulationSucceeded(newSimulation));
}

export function* saveHikesSaga({ payload: { simulationId, hikes } }) {
  debug('saveHikesSaga', { simulationId, hikes });

  const updatedHikes = [...hikes];
  mockHikesData[simulationId] = updatedHikes;

  yield put(saveHikesSucceeded(updatedHikes));
}

export default function* dataRootSaga() {
  yield all([
    takeEvery(requestSimulationsForSource, readSimulationsForSourceSaga),
    takeEvery(requestHikes, readHikesSaga),
    takeEvery(saveSimulation, saveSimulationSaga),
    takeEvery(saveNewSimulation, saveNewSimulationSaga),
    takeEvery(saveHikes, saveHikesSaga),
  ]);
}

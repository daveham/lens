import clonedeep from 'lodash.clonedeep';

import { all, delay, put, takeEvery } from '@redux-saga/core/effects';
import { restApiSaga } from 'sagas/utils';
import {
  requestHikes,
  receiveHikes,
  requestSimulationsForSource,
  receiveSimulationsForSource,
  requestSimulationsForSourceFailed,
  saveSimulation,
  saveSimulationSucceeded,
  // saveSimulationFailed,
  saveNewSimulation,
  saveNewSimulationSucceeded,
  saveNewSimulationFailed,
  deleteSimulation,
  deleteSimulationSucceeded,
  deleteSimulationFailed,
  saveHikes,
  saveHikesSucceeded,
  // saveHikesFailed,
  saveExecution,
  saveExecutionSucceeded,
  saveNewExecution,
  saveNewExecutionSucceeded,
  deleteExecution,
  deleteExecutionSucceeded,
  deleteExecutionFailed,
  saveRendering,
  saveRenderingSucceeded,
  saveNewRendering,
  saveNewRenderingSucceeded,
  deleteRendering,
  deleteRenderingSucceeded,
  deleteRenderingFailed,
} from 'editor/modules/actions/data';
import { generateMockHikesData, generateMockSimulationsData } from 'editor/sagas/mockData';

import _debug from 'debug';
const debug = _debug('lens:editor:dataSagas');

const mockSimulationsData = {};

const useMockData = false;

export function* readSimulationsForSourceSaga({ payload: { sourceId } }) {
  debug('readSimulationsForSourceSaga', { sourceId });

  if (useMockData) {
    let mockSimulations = mockSimulationsData[sourceId];
    if (!mockSimulations) {
      mockSimulations = generateMockSimulationsData(sourceId);
      mockSimulationsData[sourceId] = mockSimulations;
    }
    yield put(receiveSimulationsForSource(clonedeep(mockSimulations.filter(s => !s.isDeleted))));
  } else {
    yield* restApiSaga(
      [`/simulations/${sourceId}`],
      receiveSimulationsForSource,
      requestSimulationsForSourceFailed,
    );
  }
}

const mockHikesData = {};

export function* readHikesSaga({ payload: { simulationId } }) {
  debug('readHikesSaga', { simulationId });

  let mockHikes = mockHikesData[simulationId];
  if (!mockHikes) {
    mockHikes = generateMockHikesData(simulationId);
    mockHikesData[simulationId] = mockHikes;
  }
  yield put(receiveHikes(clonedeep(mockHikes)));
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

  yield put(saveSimulationSucceeded({ simulation: clonedeep(changedSimulation) }));
}

export function* saveNewSimulationSaga({ payload: { simulation } }) {
  debug('saveNewSimulationSaga', { simulation });

  if (useMockData) {
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
    mockSimulationsData[sourceId] = [...simulations, newSimulation];

    yield put(saveNewSimulationSucceeded(clonedeep(newSimulation)));
  } else {
    const body = { simulation };
    yield* restApiSaga(
      ['/simulations', { method: 'POST', body }],
      payload => saveNewSimulationSucceeded({ ...payload, executions: [] }),
      saveNewSimulationFailed,
    );
  }
}

export function* saveExecutionSaga({ payload: { executionId, simulationId, sourceId, changes } }) {
  debug('saveExecutionSaga', { executionId, simulationId, sourceId, changes });

  const modified = Date.now();
  const simulations = mockSimulationsData[sourceId];
  const simulation = simulations.find(s => s.id === simulationId);
  let execution = simulation.executions.find(e => e.id === executionId);

  // just mock data, don't have to be immutable
  execution = {
    ...execution,
    ...changes,
    modified,
  };

  simulation.executions = simulation.executions.map(e => (e.id === executionId ? execution : e));

  yield put(saveExecutionSucceeded({ simulationId, execution: clonedeep(execution) }));
}

export function* saveNewExecutionSaga({ payload: { sourceId, execution } }) {
  debug('saveNewExecutionSaga', { sourceId, execution });

  const created = Date.now();
  const { isNew, ...props } = execution;
  const newExecution = {
    ...props,
    created,
    modified: created,
    renderings: [],
  };
  const simulations = mockSimulationsData[sourceId];
  const simulation = simulations.find(s => s.id === execution.simulationId);
  simulation.executions = [...simulation.executions, newExecution];

  yield put(saveNewExecutionSucceeded(clonedeep(newExecution)));
}

export function* saveRenderingSaga({
  payload: { renderingId, executionId, simulationId, sourceId, changes },
}) {
  debug('saveRenderingSaga', { renderingId, executionId, simulationId, sourceId, changes });

  const modified = Date.now();
  const simulations = mockSimulationsData[sourceId];
  const simulation = simulations.find(s => s.id === simulationId);
  const execution = simulation.executions.find(e => e.id === executionId);
  let rendering = execution.renderings.find(r => r.id === renderingId);

  // just mock data, don't have to be immutable
  rendering = {
    ...rendering,
    ...changes,
    modified,
  };

  execution.renderings = execution.renderings.map(r => (r.id === renderingId ? rendering : r));

  yield put(saveRenderingSucceeded({ simulationId, executionId, rendering: clonedeep(rendering) }));
}

export function* saveNewRenderingSaga({ payload: { sourceId, rendering } }) {
  debug('saveNewRenderingSaga', { sourceId, rendering });

  const created = Date.now();
  const { isNew, ...props } = rendering;
  const newRendering = {
    ...props,
    created,
    modified: created,
  };
  const simulations = mockSimulationsData[sourceId];
  const simulation = simulations.find(s => s.id === rendering.simulationId);
  const execution = simulation.executions.find(e => e.id === rendering.executionId);
  execution.renderings = [...execution.renderings, newRendering];

  yield put(saveNewRenderingSucceeded(clonedeep(newRendering)));
}

export function* deleteSimulationSaga({ payload: { simulationId, sourceId } }) {
  debug('deleteSimulationSaga', { sourceId, simulationId });

  const simulations = mockSimulationsData[sourceId] || [];
  const simulation = simulations.find(s => s.id === simulationId);
  yield delay(0);
  if (simulation) {
    simulation.isDeleted = true;
    // mockSimulationsData[sourceId] = simulations.map(s =>
    //   s.id === simulationId ? { ...s, isDeleted: true } : s,
    // );
    yield put(deleteSimulationSucceeded({ simulationId }));
    return;
  }
  yield put(deleteSimulationFailed({ simulationId }));
}

export function* saveHikesSaga({ payload: { simulationId, hikes } }) {
  debug('saveHikesSaga', { simulationId, hikes });

  const updatedHikes = [...hikes];
  mockHikesData[simulationId] = updatedHikes;

  yield put(saveHikesSucceeded(clonedeep(updatedHikes)));
}

export function* deleteExecutionSaga({ payload: { executionId, simulationId, sourceId } }) {
  debug('deleteExecutionSaga', { sourceId, simulationId, executionId });

  const simulations = mockSimulationsData[sourceId] || [];
  const simulation = simulations.find(s => s.id === simulationId);
  yield delay(0);
  if (simulation) {
    const execution = simulation.executions.find(e => e.id === executionId);
    if (execution) {
      execution.isDeleted = true;
      yield put(deleteExecutionSucceeded({ executionId, simulationId }));
      return;
    }
  }
  yield put(deleteExecutionFailed({ executionId, simulationId }));
}

export function* deleteRenderingSaga({
  payload: { renderingId, executionId, simulationId, sourceId },
}) {
  debug('deleteRenderingSaga', { sourceId, simulationId, executionId, renderingId });

  const simulations = mockSimulationsData[sourceId] || [];
  const simulation = simulations.find(s => s.id === simulationId);
  yield delay(0);
  if (simulation) {
    const execution = simulation.executions.find(e => e.id === executionId);
    if (execution) {
      const rendering = execution.renderings.find(r => r.id === renderingId);
      if (rendering) {
        rendering.isDeleted = true;
        yield put(deleteRenderingSucceeded({ renderingId, executionId, simulationId }));
        return;
      }
    }
  }
  yield put(deleteRenderingFailed({ renderingId, executionId, simulationId }));
}

export default function* dataRootSaga() {
  yield all([
    takeEvery(requestSimulationsForSource, readSimulationsForSourceSaga),
    takeEvery(requestHikes, readHikesSaga),
    takeEvery(saveSimulation, saveSimulationSaga),
    takeEvery(saveNewSimulation, saveNewSimulationSaga),
    takeEvery(deleteSimulation, deleteSimulationSaga),
    takeEvery(saveHikes, saveHikesSaga),
    takeEvery(saveExecution, saveExecutionSaga),
    takeEvery(saveNewExecution, saveNewExecutionSaga),
    takeEvery(deleteExecution, deleteExecutionSaga),
    takeEvery(saveRendering, saveRenderingSaga),
    takeEvery(saveNewRendering, saveNewRenderingSaga),
    takeEvery(deleteRendering, deleteRenderingSaga),
  ]);
}

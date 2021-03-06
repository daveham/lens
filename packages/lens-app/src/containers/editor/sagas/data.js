import clonedeep from 'lodash.clonedeep';

import { all, delay, put, select, takeEvery } from '@redux-saga/core/effects';
import { restApiSaga } from 'sagas/utils';
import {
  requestHikes,
  receiveHikes,
  requestHikesFailed,
  requestSimulationsForSource,
  receiveSimulationsForSource,
  requestSimulationsForSourceFailed,
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
  saveExecution,
  saveExecutionSucceeded,
  saveExecutionFailed,
  saveNewExecution,
  saveNewExecutionSucceeded,
  saveNewExecutionFailed,
  deleteExecution,
  deleteExecutionSucceeded,
  deleteExecutionFailed,
  runExecution,
  runExecutionSucceeded,
  runExecutionFailed,
  saveRendering,
  saveRenderingSucceeded,
  saveRenderingFailed,
  saveNewRendering,
  saveNewRenderingSucceeded,
  saveNewRenderingFailed,
  deleteRendering,
  deleteRenderingSucceeded,
  deleteRenderingFailed,
} from 'editor/modules/actions/data';
import {
  simulationByIdSelector,
  executionByIdSelector,
  // renderingByIdSelector,
} from 'editor/modules/selectors';
import { clientId as clientIdSelector } from 'modules/selectors';
import { generateMockHikesData, generateMockSimulationsData } from 'editor/sagas/mockData';

import getDebugLog from './debugLog';
const debug = getDebugLog('data');

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

export function* readHikesSaga({ payload: { sourceId, simulationId } }) {
  debug('readHikesSaga', { sourceId, simulationId });

  if (useMockData) {
    let mockHikes = mockHikesData[simulationId];
    if (!mockHikes) {
      mockHikes = generateMockHikesData(simulationId);
      mockHikesData[simulationId] = mockHikes;
    }
    yield put(receiveHikes(clonedeep(mockHikes)));
  } else {
    yield* restApiSaga([`/hikes/${sourceId}/${simulationId}`], receiveHikes, requestHikesFailed);
  }
}

export function* saveSimulationSaga({ payload: { simulationId, sourceId, changes } }) {
  debug('saveSimulationSaga', { simulationId, sourceId, changes });

  if (useMockData) {
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

    yield put(saveSimulationSucceeded(clonedeep(changedSimulation)));
  } else {
    const { simulation: originalSimulation } = yield select(simulationByIdSelector, simulationId);
    const body = { changes };
    yield* restApiSaga(
      [`/simulations/${simulationId}`, { method: 'PUT', body }],
      payload => saveSimulationSucceeded({ ...payload, executions: originalSimulation.executions }),
      saveSimulationFailed,
    );
  }
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
    const { executions: ignoredExecutions, isNew: ignoredIsNew, ...storedValues } = simulation;
    const body = { simulation: { ...storedValues } };
    yield* restApiSaga(
      ['/simulations', { method: 'POST', body }],
      payload => saveNewSimulationSucceeded({ ...payload, executions: [] }),
      saveNewSimulationFailed,
    );
  }
}

export function* saveExecutionSaga({ payload: { executionId, simulationId, sourceId, changes } }) {
  debug('saveExecutionSaga', { executionId, simulationId, sourceId, changes });

  if (useMockData) {
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
  } else {
    const { execution: originalExecution } = yield select(
      executionByIdSelector,
      simulationId,
      executionId,
    );
    const body = { changes };
    yield* restApiSaga(
      [`/executions/${executionId}`, { method: 'PUT', body }],
      payload => saveExecutionSucceeded({ ...payload, renderings: originalExecution.renderings }),
      saveExecutionFailed,
    );
  }
}

export function* saveNewExecutionSaga({ payload: { sourceId, execution } }) {
  debug('saveNewExecutionSaga', { sourceId, execution });

  if (useMockData) {
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
  } else {
    const { renderings: ignoredRenderings, isNew: ignoredIsNew, ...storedValues } = execution;
    const body = { execution: { ...storedValues } };
    yield* restApiSaga(
      ['/executions', { method: 'POST', body }],
      payload => saveNewExecutionSucceeded({ ...payload, renderings: [] }),
      saveNewExecutionFailed,
    );
  }
}

export function* saveRenderingSaga({
  payload: { renderingId, executionId, simulationId, sourceId, changes },
}) {
  debug('saveRenderingSaga', { renderingId, executionId, simulationId, sourceId, changes });

  if (useMockData) {
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

    yield put(
      saveRenderingSucceeded({
        simulationId,
        executionId,
        rendering: clonedeep(rendering),
      }),
    );
  } else {
    const body = { changes };
    yield* restApiSaga(
      [`/renderings/${renderingId}`, { method: 'PUT', body }],
      saveRenderingSucceeded,
      saveRenderingFailed,
    );
  }
}

export function* saveNewRenderingSaga({ payload: { sourceId, rendering } }) {
  debug('saveNewRenderingSaga', { sourceId, rendering });

  if (useMockData) {
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
  } else {
    const { isNew: ignoredIsNew, ...storedValues } = rendering;
    const body = { rendering: { ...storedValues } };
    yield* restApiSaga(
      ['/renderings', { method: 'POST', body }],
      saveNewRenderingSucceeded,
      saveNewRenderingFailed,
    );
  }
}

export function* deleteSimulationSaga({ payload: { simulationId, sourceId } }) {
  debug('deleteSimulationSaga', { sourceId, simulationId });

  if (useMockData) {
    const simulations = mockSimulationsData[sourceId] || [];
    const simulation = simulations.find(s => s.id === simulationId);
    yield delay(0);
    if (simulation) {
      simulation.isDeleted = true;
      // mockSimulationsData[sourceId] = simulations.map(s =>
      //   s.id === simulationId ? { ...s, isDeleted: true } : s,
      // );
      yield put(deleteSimulationSucceeded({ simulationId, sourceId }));
      return;
    }
    yield put(deleteSimulationFailed({ simulationId }));
  } else {
    const body = { changes: { isDeleted: true } };
    yield* restApiSaga(
      [`/simulations/${simulationId}`, { method: 'PUT', body }],
      () => deleteSimulationSucceeded({ simulationId, sourceId }),
      deleteSimulationFailed,
    );
  }
}

export function* saveHikesSaga({ payload: { sourceId, simulationId, hikes } }) {
  debug('saveHikesSaga', { sourceId, simulationId, hikes });

  if (useMockData) {
    const updatedHikes = [...hikes];
    mockHikesData[simulationId] = updatedHikes;

    yield put(saveHikesSucceeded(clonedeep(updatedHikes)));
  } else {
    const body = { hikes };
    yield* restApiSaga(
      [`/hikes/${sourceId}/${simulationId}`, { method: 'POST', body }],
      saveHikesSucceeded,
      saveHikesFailed,
    );
  }
}

export function* deleteExecutionSaga({ payload: { executionId, simulationId, sourceId } }) {
  debug('deleteExecutionSaga', { sourceId, simulationId, executionId });

  if (useMockData) {
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
  } else {
    const body = { changes: { isDeleted: true } };
    yield* restApiSaga(
      [`/executions/${executionId}`, { method: 'PUT', body }],
      () => deleteExecutionSucceeded({ executionId, simulationId, sourceId }),
      deleteExecutionFailed,
    );
  }
}

export function* runExecutionSaga({ payload: { executionId, simulationId, sourceId } }) {
  debug('runExecutionSaga', { executionId, simulationId, sourceId });
  const clientId = yield select(clientIdSelector);

  const body = {
    clientId,
    executionId,
    simulationId,
    sourceId,
  };
  yield* restApiSaga(
    [`/executions/${executionId}/run`, { method: 'POST', body }],
    runExecutionSucceeded,
    runExecutionFailed,
  );
}

export function* deleteRenderingSaga({
  payload: { renderingId, executionId, simulationId, sourceId },
}) {
  debug('deleteRenderingSaga', { sourceId, simulationId, executionId, renderingId });

  if (useMockData) {
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
  } else {
    const body = { changes: { isDeleted: true } };
    yield* restApiSaga(
      [`/renderings/${renderingId}`, { method: 'PUT', body }],
      () => deleteRenderingSucceeded({ renderingId, executionId, simulationId, sourceId }),
      deleteRenderingFailed,
    );
  }
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
    takeEvery(runExecution, runExecutionSaga),
    takeEvery(saveRendering, saveRenderingSaga),
    takeEvery(saveNewRendering, saveNewRenderingSaga),
    takeEvery(deleteRendering, deleteRenderingSaga),
  ]);
}

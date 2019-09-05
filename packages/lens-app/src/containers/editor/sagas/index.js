import { takeEvery, select, all, put } from 'redux-saga/effects';
// import { apiSaga, invokeRestService } from 'sagas/utils';
import { ACTIONS } from '../modules/constants';
import {
  receiveSimulationsForSource,
  // requestSimulationsForSourceFailed,
} from '../modules/actions';
import {
  catalogName as catalogNameSelector,
  catalogSources as catalogSourcesSelector,
} from 'containers/catalog/selectors';
import { setTitle } from 'modules/ui';

import _debug from 'debug';
const debug = _debug('lens:editor:sagas');

export function* ensureTitleSaga({ payload }) {
  const catalogName = yield select(catalogNameSelector);
  if (payload) {
    const catalogSources = yield select(catalogSourcesSelector);
    const sourceName = catalogSources.byIds[payload].name;
    yield put(setTitle({
      catalogName,
      sourceName,
    }));
  } else {
    yield put(setTitle({ catalogName }));
  }
}

let globalId = 1001;
function uuid() {
  globalId += 1;
  return `a-${globalId}`;
}

function generateMockRendering(simulationId, executionId) {
  const created = Date.now();
  const id = uuid();
  return {
    id,
    created,
    modified: created,
    simulationId,
    executionId,
    name: `sim${simulationId}-ex${executionId}-ren${id}`,
  };
}

function generateMockExecution(simulationId, renderingCount) {
  const created = Date.now();
  const id = uuid();
  const execution = {
    id,
    created,
    modified: created,
    simulationId,
    renderings: [],
    name: `sim${simulationId}-ex${id}`,
  };

  for (let i = 0; i < renderingCount; i++) {
    execution.renderings.push(generateMockRendering(simulationId, id));
  }
  return execution;
}

function generateMockSimulation(sourceId, renderingCounts) {
  const created = Date.now();
  const id = uuid();
  return {
    id,
    created,
    modified: created,
    sourceId,
    executions: renderingCounts.map(n => generateMockExecution(id, n)),
    name: `sim${id}`,
  };
}

function generateMockData(sourceId) {
  const sims = [];
  sims.push(generateMockSimulation(sourceId, [4, 3, 7]));
  sims.push(generateMockSimulation(sourceId, [3, 2, 9, 6, 4]));
  return sims;
}

export function* readSimulationsForSourceSaga({ payload }) {
  debug('readSimulationsForSourceSaga', { payload });

  const mockData = generateMockData(payload);
  yield put(receiveSimulationsForSource(mockData));

  // yield* apiSaga(invokeRestService,
  //   [ `/simulations/${payload}` ],
  //   receiveSimulationsForSource,
  //   requestSimulationsForSourceFailed);
}

export function* rootSaga() {
  yield all([
    takeEvery(ACTIONS.ENSURE_EDITOR_TITLE, ensureTitleSaga),
    takeEvery(ACTIONS.REQUEST_SIMULATIONS_FOR_SOURCE, readSimulationsForSourceSaga),
  ]);
}

export default { key: 'editor', saga: rootSaga };

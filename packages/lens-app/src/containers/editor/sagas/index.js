import { takeEvery, select, all, put } from 'redux-saga/effects';
// import { apiSaga, invokeRestService } from 'sagas/utils';
import { ACTIONS } from '../modules/constants';
import {
  receiveSimulationsForSource,
  receiveHikes,
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

function generateMockSimulationsData(sourceId) {
  const sims = [];
  sims.push(generateMockSimulation(sourceId, [4, 3, 7]));
  sims.push(generateMockSimulation(sourceId, [3, 2, 9, 6, 4]));
  return sims;
}

const hikeData = {
  name: 'Simple Hike',
  type: 'simple',
  size: 'full',
  logger: 'none',
  trackWriter: 'none',
};

const trailsData = [
  { name: 'Simple Trail', type: 'simple' },
  { name: 'One Trail', type: 'simple' },
  { name: 'Two Trail', type: 'simple' },
  { name: 'Three Trail', type: 'simple' },
];

const hikersData = [
  { name: 'Simple Hiker', type: 'simple' },
  { name: 'One Hiker', type: 'simple' },
  { name: 'Two Hiker', type: 'simple' },
  { name: 'Three Hiker', type: 'simple' },
  { name: 'Four Hiker', type: 'simple' },
  { name: 'Five Hiker', type: 'simple' },
  { name: 'Six Hiker', type: 'simple' },
  { name: 'Seven Hiker', type: 'simple' },
  { name: 'Eight Hiker', type: 'simple' },
];

function generateMockHike() {
  const hike = { ...hikeData, id: uuid(), order: 0 };
  hike.trails = trailsData.map((t, index) => ({ ...t, id: uuid(), hikeId: hike.id, order: index }));
  hike.trails.forEach((t) => {
    t.hikers = hikersData.map((k, index) => ({ ...k, id: uuid(), trailId: t.id, order: index }));
  });
  return hike;
}

function generateMockHikesData(simulationId) {
  return [generateMockHike(uuid())];
}

export function* readSimulationsForSourceSaga({ payload }) {
  debug('readSimulationsForSourceSaga', { payload });

  const mockData = generateMockSimulationsData(payload);
  yield put(receiveSimulationsForSource(mockData));

  // yield* apiSaga(invokeRestService,
  //   [ `/simulations/${payload}` ],
  //   receiveSimulationsForSource,
  //   requestSimulationsForSourceFailed);
}

export function* readHikesSaga({ payload }) {
  debug('readHikesSaga', { payload });
  const mockData = generateMockHikesData(payload);
  yield put(receiveHikes(mockData));
}

export function* rootSaga() {
  yield all([
    takeEvery(ACTIONS.ENSURE_EDITOR_TITLE, ensureTitleSaga),
    takeEvery(ACTIONS.REQUEST_SIMULATIONS_FOR_SOURCE, readSimulationsForSourceSaga),
    takeEvery(ACTIONS.REQUEST_HIKES, readHikesSaga),
  ]);
}

export default { key: 'editor', saga: rootSaga };

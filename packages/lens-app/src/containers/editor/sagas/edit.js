import { takeEvery, all, put, call } from 'redux-saga/effects';

import {
  changeSimulation,
  changeHike,
  changeHikeList,
  changeTrail,
  changeTrailList,
  changeHiker,
  changeHikerList,

  updateSimulation,
  updateHike,
  updateHikes,
  updateTrail,
  updateTrails,
  updateHiker,
  updateHikers,
} from 'editor/modules/actions';

// import _debug from 'debug';
// const debug = _debug('lens:editor:sagas:edit');

const emptyArray = [];
const extractOrderChanges = (items, removed = emptyArray) => {
  const changes = items.reduce((ac, item, index) => {
    if (item.order !== index) {
      ac.push({ id: item.id, changes: { order: index } });
    }
    return ac;
  }, []);
  if (removed.length) {
    removed.forEach(r => {
      // @ts-ignore
      changes.push({ id: r.id, changes: { isDeleted: true } });
    });
  }
  return changes;
};

export function* changeSimulationSaga({ payload: { changes } }) {
  yield put(updateSimulation(changes));
}

export function* changeHikeSaga({ payload: { id, changes } }) {
  yield put(updateHike({ id, changes }));
}

export function* changeTrailSaga({ payload: { id, changes } }) {
  yield put(updateTrail({ id, changes }));
}

export function* changeHikerSaga({ payload: { id, changes } }) {
  yield put(updateHiker({ id, changes }));
}

export function* changeHikeListSaga({ payload: { items, removed } }) {
  const changeList = extractOrderChanges(items, removed);
  if (changeList.length) {
    yield put(updateHikes(changeList));
  }
}

export function* changeTrailListSaga({ payload: { items, removed } }) {
  const changeList = extractOrderChanges(items, removed);
  if (changeList.length) {
    yield put(updateTrails(changeList));
  }
}

export function* changeHikerListSaga({ payload: { items, removed } }) {
  const changeList = extractOrderChanges(items, removed);
  if (changeList.length) {
    yield put(updateHikers(changeList));
  }
}

// This way starts a saga for each action/handler.
// export default function* editSaga() {
//   yield all([
//     takeEvery(changeSimulation, changeSimulationSaga),
//     takeEvery(changeHike, changeHikeSaga),
//     takeEvery(changeHikeList, changeHikeListSaga),
//     takeEvery(changeTrail, changeTrailSaga),
//     takeEvery(changeTrailList, changeTrailListSaga),
//     takeEvery(changeHiker, changeHikerSaga),
//     takeEvery(changeHikerList, changeHikerListSaga),
//   ]);
// }

// This way starts fewer sagas - in case that becomes an issue.
const changeMap = {
  [changeSimulation]: changeSimulationSaga,
  [changeHike]: changeHikeSaga,
  [changeHikeList]: changeHikeListSaga,
  [changeTrail]: changeTrailSaga,
  [changeTrailList]: changeTrailListSaga,
  [changeHiker]: changeHikerSaga,
  [changeHikerList]: changeHikerListSaga,
};

export function* changeSwitchSaga(action) {
  const handler = changeMap[action.type];
  if (handler) {
    yield call(handler, action);
  }
}

export default function* editChangeSaga() {
  yield all([
    takeEvery(action => !!(action.type && action.type.startsWith('editor-sagas')), changeSwitchSaga),
  ]);
}


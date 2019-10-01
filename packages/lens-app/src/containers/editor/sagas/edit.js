import { takeEvery, all, put } from 'redux-saga/effects';

import {
  editorChangeActions,
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

export default function* editSaga() {
  yield all([
    takeEvery(editorChangeActions.changeSimulation, changeSimulationSaga),
    takeEvery(editorChangeActions.changeHike, changeHikeSaga),
    takeEvery(editorChangeActions.changeHikeList, changeHikeListSaga),
    takeEvery(editorChangeActions.changeTrail, changeTrailSaga),
    takeEvery(editorChangeActions.changeTrailList, changeTrailListSaga),
    takeEvery(editorChangeActions.changeHiker, changeHikerSaga),
    takeEvery(editorChangeActions.changeHikerList, changeHikerListSaga),
  ]);
}

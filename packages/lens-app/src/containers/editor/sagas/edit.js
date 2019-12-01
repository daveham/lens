import { all, takeEvery, put, select, call } from 'redux-saga/effects';

import {
  changeSimulation,
  changeHike,
  changeHikeList,
  changeTrail,
  changeTrailList,
  changeHiker,
  changeHikerList,
  EDITOR_ACTIONS_PREFIX_SIMULATION_SAGAS,
} from 'editor/modules/actions/sagas';

import {
  updateSelectedSimulation,
  addHike,
  updateHike,
  updateHikes,
  addTrail,
  updateTrail,
  updateTrails,
  addHiker,
  updateHiker,
  updateHikers,
  editorActionValid,
} from 'editor/modules/actions/ui';

import { simulationAndDataValid } from 'editor/modules/selectors';

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

const nameRequiredRule = {
  key: 'name',
  validate: target => target.name && target.name.length > 0,
  message: 'A name is required',
};

const simulationRules = {
  name: nameRequiredRule,
};

const hikeRules = {
  name: nameRequiredRule,
};

const trailRules = {
  name: nameRequiredRule,
};

const hikerRules = {
  name: nameRequiredRule,
};

const getValidationRulesForChanges = (rulesByKey, changes) =>
  Object.keys(changes).reduce((ac, key) => {
    if (rulesByKey[key]) {
      ac.push(rulesByKey[key]);
    }
    return ac;
  }, []);

const evaluateValidationRules = (current, rules) => {
  const changes = [];
  rules.forEach(rule => {
    const errorKey = `${rule.key}Error`;
    if (rule.validate(current)) {
      if (current[errorKey]) {
        changes[errorKey] = undefined;
      }
    } else {
      if (!current[errorKey]) {
        changes[errorKey] = rule.message;
      }
    }
  });
  return changes;
};

export function* changeSimulationSaga({ payload: { changes } }) {
  yield put(updateSelectedSimulation(changes));

  const current = yield select(state => state.editor.simulation);

  const rules = getValidationRulesForChanges(simulationRules, changes);
  const validationChanges = evaluateValidationRules(current, rules);
  if (Object.keys(validationChanges).length > 0) {
    yield put(updateSelectedSimulation(validationChanges));
  }
}

export function* changeHikeSaga({ payload: { id, changes } }) {
  yield put(updateHike({ id, changes }));

  const current = yield select(state => state.editor.hikesById[id]);

  const rules = getValidationRulesForChanges(hikeRules, changes);
  const validationChanges = evaluateValidationRules(current, rules);
  if (Object.keys(validationChanges).length > 0) {
    yield put(updateHike({ id, changes: validationChanges }));
  }
}

export function* changeTrailSaga({ payload: { id, changes } }) {
  yield put(updateTrail({ id, changes }));

  const current = yield select(state => state.editor.trailsById[id]);

  const rules = getValidationRulesForChanges(trailRules, changes);
  const validationChanges = evaluateValidationRules(current, rules);
  if (Object.keys(validationChanges).length > 0) {
    yield put(updateTrail({ id, changes: validationChanges }));
  }
}

export function* changeHikerSaga({ payload: { id, changes } }) {
  yield put(updateHiker({ id, changes }));

  const current = yield select(state => state.editor.hikersById[id]);

  const rules = getValidationRulesForChanges(hikerRules, changes);
  const validationChanges = evaluateValidationRules(current, rules);
  if (Object.keys(validationChanges).length > 0) {
    yield put(updateHiker({ id, changes: validationChanges }));
  }
}

export function* changeHikeListSaga({ payload: { items, removed, newHike } }) {
  const changeList = extractOrderChanges(items, removed);
  if (changeList.length) {
    yield put(updateHikes(changeList));
  }
  if (newHike) {
    yield put(addHike({ hike: newHike }));
  }
}

export function* changeTrailListSaga({ payload: { hikeId, items, removed, newTrail } }) {
  const changeList = extractOrderChanges(items, removed);
  if (changeList.length) {
    yield put(updateTrails(changeList));
  }
  if (newTrail) {
    yield put(addTrail({ hikeId, trail: newTrail }));
  }
}

export function* changeHikerListSaga({ payload: { hikeId, trailId, items, removed, newHiker } }) {
  const changeList = extractOrderChanges(items, removed);
  if (changeList.length) {
    yield put(updateHikers(changeList));
  }
  if (newHiker) {
    yield put(addHiker({ hikeId, trailId, hiker: newHiker }));
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
    const isValid = yield select(simulationAndDataValid);
    yield put(editorActionValid(isValid));
  }
}

export default function* editRootSaga() {
  yield all([
    takeEvery(
      action => !!(action.type && action.type.startsWith(EDITOR_ACTIONS_PREFIX_SIMULATION_SAGAS)),
      changeSwitchSaga,
    ),
  ]);
}

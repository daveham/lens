import { handleActions, combineActions } from 'redux-actions';
import { combineReducers } from 'redux';
import {
  requestSimulationsForSource,
  receiveSimulationsForSource,
  requestSimulationsForSourceFailed,
  requestHikes,
  receiveHikes,
  requestHikesFailed,
} from './actions';
import { ACTIONS } from './constants';
import { InsertableReducerType } from 'modules/types';

import _debug from 'debug';
const debug = _debug('lens:editor:modules:reducers');

debug('keys for handleActions', {
  one: `${requestSimulationsForSource}`,
  two: `${receiveSimulationsForSource}`,
  three: `${requestSimulationsForSourceFailed}`,
});

// reducers
const simulationsLoading = handleActions({
  [requestSimulationsForSource]: (state, action) => true,
  [combineActions(receiveSimulationsForSource, requestSimulationsForSourceFailed)]: (state, action) => false,
}, false);

const initialSimulationsState = [];
const simulations = handleActions({
  [receiveSimulationsForSource]: (state, { payload }) => payload,
}, initialSimulationsState);

const hikesLoading = handleActions({
  [requestHikes]: (state, action) => true,
  [combineActions(receiveHikes, requestHikesFailed)]: (state, action) => false,
}, false);

const initialHikesState = [];
const hikes = (state = initialHikesState, { type, payload }) => {
  if (type === `${receiveHikes}`) {
    return payload;
  }
  return state;
};

const initialSimulationState = {};
const simulation = (state = initialSimulationState, { type, payload }) => {
  switch(type) {
    case ACTIONS.SET_SIMULATION:
      return payload || initialSimulationState;
    case ACTIONS.UPDATE_SIMULATION:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};

const updateItemWithChanges = (state, { id, changes }) => {
  const changedItem = {
    ...state[id],
    ...changes,
  };
  return {
    ...state,
    [id]: changedItem,
  };
};

const updateItemsWithChanges = (state, changeList) => {
  const changedItems = changeList.map(({ id, changes }) => ({
    ...state[id],
    ...changes,
  }));
  const newState = { ...state };
  changedItems.forEach(item => {
    newState[item.id] = item;
  });
  return newState;
};

const initialEditorHikesState = {};
const hikesById = (state = initialEditorHikesState, { type, payload}) => {
  switch(type) {
    case `${receiveHikes}`:
      const allHikes = {};
      payload.forEach(({ id, trails, ...props }) => {
        allHikes[id] = { id, ...props };
      });
      return allHikes;
    case ACTIONS.UPDATE_HIKE:
      return updateItemWithChanges(state, payload);
    case ACTIONS.UPDATE_HIKES:
      return updateItemsWithChanges(state, payload);
    default:
      return state;
  }
};

const initialEditorTrailsState = {};
const trailsById = (state = initialEditorTrailsState, { type, payload}) => {
  switch(type) {
    case `${receiveHikes}`:
      const allTrails = {};
      payload.forEach((h => h.trails.forEach((({ id, hikers, ...props }) => {
        allTrails[id] = { id, ...props };
      }))));
      return allTrails;
    case ACTIONS.UPDATE_TRAIL:
      return updateItemWithChanges(state, payload);
    case ACTIONS.UPDATE_TRAILS:
      return updateItemsWithChanges(state, payload);
    default:
      return state;
  }
};

const initialEditorHikersState = {};
const hikersById = (state = initialEditorHikersState, { type, payload}) => {
  switch(type) {
    case `${receiveHikes}`:
      const allHikers = {};
      payload.forEach((h => h.trails.forEach((t => t.hikers.forEach((k => {
        allHikers[k.id] = k;
      }))))));
      return allHikers;
    case ACTIONS.UPDATE_HIKER:
      return updateItemWithChanges(state, payload);
    case ACTIONS.UPDATE_HIKERS:
      return updateItemsWithChanges(state, payload);
    default:
      return state;
  }
};

const actionEnabled = (state = false, { type, payload }) => {
  switch(type) {
    case ACTIONS.EDITOR_ACTION_ENABLED:
      return true;
    case ACTIONS.EDITOR_ACTION_DISABLED:
      return false;
    default:
      return state;
  }
};

const actionValid = (state = false, { type, payload }) => {
  switch(type) {
    case ACTIONS.EDITOR_ACTION_VALID:
      return true;
    case ACTIONS.EDITOR_ACTION_INVALID:
      return false;
    default:
      return state;
  }
};

const active = (state = '', { type, payload }) => {
  if (type === ACTIONS.SET_ACTIVE_SCOPE) {
    return payload;
  }
  return state;
};

const editorModuleReducer = combineReducers({
  simulationsLoading,
  simulations,
  hikesLoading,
  hikes,
  hikesById,
  trailsById,
  hikersById,
  simulation,
  actionEnabled,
  actionValid,
  active,
});

export type EditorModuleState = ReturnType<typeof editorModuleReducer>;
export type InsertableEditorModuleReducer = typeof editorModuleReducer
  & InsertableReducerType;

const insertableEditorModuleReducer: InsertableEditorModuleReducer = editorModuleReducer;

insertableEditorModuleReducer.reducer = 'editor';

export default insertableEditorModuleReducer;

export interface RootEditorState {
  editor: EditorModuleState;
}

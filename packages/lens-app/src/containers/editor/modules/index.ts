import { handleActions, combineActions } from 'redux-actions';
import { combineReducers } from 'redux';
import {
  requestSimulationsForSource,
  receiveSimulationsForSource,
  requestSimulationsForSourceFailed,
  requestHikes,
  receiveHikes,
  requestHikesFailed,
  setSimulation,
  updateSimulation,
  addHike,
  updateHike,
  updateHikes,
  addTrail,
  updateTrail,
  updateTrails,
  addHiker,
  updateHiker,
  updateHikers,
  setActiveScope,
  editorActionValid,
} from './actions';
import { InsertableReducerType } from 'modules/types';

// import _debug from 'debug';
// const debug = _debug('lens:editor:modules:reducers');

// reducers
const simulationsLoading = handleActions(
  {
    [requestSimulationsForSource]: () => true,
    [combineActions(receiveSimulationsForSource, requestSimulationsForSourceFailed)]: () => false,
  },
  false,
);

const initialSimulationsState = [];
const simulations = handleActions(
  {
    [receiveSimulationsForSource]: (state, { payload }) => payload,
  },
  initialSimulationsState,
);

const hikesLoading = handleActions(
  {
    [requestHikes]: () => true,
    [combineActions(receiveHikes, requestHikesFailed)]: () => false,
  },
  false,
);

const initialHikesState = [];
const hikes = handleActions(
  {
    [receiveHikes]: (state, { payload }) => payload,
    [addHike]: (state, { payload: { hike } }) => [...state, hike],
    [addTrail]: (state, { payload: { hikeId, trail } }) =>
      state.map(h =>
        h.id === hikeId
          ? {
              ...h,
              trails: [...h.trails, trail],
            }
          : h,
      ),
    [addHiker]: (state, { payload: { hikeId, trailId, hiker } }) =>
      state.map(h =>
        h.id === hikeId
          ? {
              ...h,
              trails: h.trails.map(t =>
                t.id === trailId
                  ? {
                      ...t,
                      hikers: [...t.hikers, hiker],
                    }
                  : t,
              ),
            }
          : h,
      ),
  },
  initialHikesState,
);

const initialSimulationState = {};
const simulation = handleActions(
  {
    [setSimulation]: (state, { payload }) => payload || initialSimulationState,
    [updateSimulation]: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
  },
  initialSimulationState,
);

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
const hikesById = handleActions(
  {
    [addHike]: (state, { payload: { hike } }) => {
      return {
        ...state,
        [hike.id]: hike,
      };
    },
    [receiveHikes]: (state, { payload }) => {
      const allHikes = {};
      payload.forEach(({ id, trails, ...props }) => {
        allHikes[id] = { id, ...props };
      });
      return allHikes;
    },
    [updateHike]: (state, { payload }) => updateItemWithChanges(state, payload),
    [updateHikes]: (state, { payload }) => updateItemsWithChanges(state, payload),
  },
  initialEditorHikesState,
);

const initialEditorTrailsState = {};
const trailsById = handleActions(
  {
    [addTrail]: (state, { payload: { trail } }) => {
      return {
        ...state,
        [trail.id]: trail,
      };
    },
    [receiveHikes]: (state, { payload }) => {
      const allTrails = {};
      payload.forEach(h =>
        h.trails.forEach(({ id, hikers, ...props }) => {
          allTrails[id] = { id, ...props };
        }),
      );
      return allTrails;
    },
    [updateTrail]: (state, { payload }) => updateItemWithChanges(state, payload),
    [updateTrails]: (state, { payload }) => updateItemsWithChanges(state, payload),
  },
  initialEditorTrailsState,
);

const initialEditorHikersState = {};
const hikersById = handleActions(
  {
    [addHiker]: (state, { payload: { hiker } }) => {
      return {
        ...state,
        [hiker.id]: hiker,
      };
    },
    [receiveHikes]: (state, { payload }) => {
      const allHikers = {};
      payload.forEach(h =>
        h.trails.forEach(t =>
          t.hikers.forEach(k => {
            allHikers[k.id] = k;
          }),
        ),
      );
      return allHikers;
    },
    [updateHiker]: (state, { payload }) => updateItemWithChanges(state, payload),
    [updateHikers]: (state, { payload }) => updateItemsWithChanges(state, payload),
  },
  initialEditorHikersState,
);

// used to enable/disable the save/other button for edit/new operations
//  operations related to starting edit/new, changing data during edit/new should dispatch
//  into this reducer using 'editorActionValid'
const actionValid = handleActions(
  {
    [editorActionValid]: (state, { payload }) => payload,
  },
  false,
);

const active = handleActions(
  {
    [setActiveScope]: (state, { payload }) => payload,
  },
  '',
);

const editorModuleReducer = combineReducers({
  simulationsLoading,
  simulations,
  hikesLoading,
  hikes,
  hikesById,
  trailsById,
  hikersById,
  simulation,
  actionValid,
  active,
});

export type EditorModuleState = ReturnType<typeof editorModuleReducer>;
export type InsertableEditorModuleReducer = typeof editorModuleReducer & InsertableReducerType;

const insertableEditorModuleReducer: InsertableEditorModuleReducer = editorModuleReducer;

insertableEditorModuleReducer.reducer = 'editor';

export default insertableEditorModuleReducer;

export interface RootEditorState {
  editor: EditorModuleState;
}

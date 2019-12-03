import { handleActions, combineActions } from 'redux-actions';
import { combineReducers } from 'redux';
import {
  startNewSimulation,
  newSimulationStarted,
  finishNewSimulation,
  newSimulationFinished,
  cancelNewSimulation,
  newSimulationCanceled,
  startEditSimulation,
  editSimulationStarted,
  finishEditSimulation,
  editSimulationFinished,
  cancelEditSimulation,
  editSimulationCanceled,
  startDeleteSimulation,
  deleteSimulationStarted,
  finishDeleteSimulation,
  deleteSimulationFinished,
  cancelDeleteSimulation,
  deleteSimulationCanceled,
  deleteExecutionStarted,
  editExecutionStarted,
  newExecutionStarted,
  finishDeleteExecution,
  deleteExecutionFinished,
  cancelDeleteExecution,
  deleteExecutionCanceled,
  editExecutionFinished,
  editExecutionCanceled,
  newExecutionFinished,
  newExecutionCanceled,
  finishEditExecution,
  cancelEditExecution,
  finishNewExecution,
  cancelNewExecution,
  finishDeleteRendering,
  deleteRenderingFinished,
  cancelDeleteRendering,
  deleteRenderingCanceled,
} from './actions/operations';
import {
  requestSimulationsForSource,
  receiveSimulationsForSource,
  requestSimulationsForSourceFailed,
  requestHikes,
  receiveHikes,
  requestHikesFailed,
  saveSimulationSucceeded,
  saveNewSimulationSucceeded,
  saveHikesSucceeded,
  deleteSimulationSucceeded,
} from './actions/data';
import {
  setSelectedSimulation,
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
  setSelectedExecution,
  updateSelectedExecution,
  setSelectedRendering,
  updateSelectedRendering,
  setActiveScope,
  editorActionValid,
} from './actions/ui';
import { InsertableReducerType } from 'modules/types';
import { IHike, ISimulation } from 'editor/interfaces';

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

const initialSimulationsState: ReadonlyArray<ISimulation> = [];
const simulations = handleActions(
  {
    [receiveSimulationsForSource]: (state, { payload }) => payload,
    [saveSimulationSucceeded]: (state, { payload }) =>
      state.map(s => (s.id === payload.id ? payload : s)),
    [saveNewSimulationSucceeded]: (state, { payload }) => [...state, payload],
    [deleteSimulationSucceeded]: (state, { payload: { simulationId } }) =>
      state.filter(s => s.id !== simulationId),
  },
  initialSimulationsState,
);

const operationEnded = handleActions(
  {
    [combineActions(
      deleteSimulationStarted,
      editSimulationStarted,
      newSimulationStarted,
      deleteExecutionStarted,
      editExecutionStarted,
      newExecutionStarted,
    )]: () => false,
    [combineActions(
      deleteSimulationFinished,
      deleteSimulationCanceled,
      editSimulationFinished,
      editSimulationCanceled,
      newSimulationFinished,
      newSimulationCanceled,
      deleteExecutionFinished,
      deleteExecutionCanceled,
      editExecutionFinished,
      editExecutionCanceled,
      newExecutionFinished,
      newExecutionCanceled,
    )]: () => true,
  },
  false,
);

const operationPending = handleActions(
  {
    [combineActions(
      finishDeleteSimulation,
      cancelDeleteSimulation,
      finishEditSimulation,
      cancelEditSimulation,
      finishNewSimulation,
      cancelNewSimulation,
      finishDeleteExecution,
      cancelDeleteExecution,
      finishEditExecution,
      cancelEditExecution,
      finishNewExecution,
      cancelNewExecution,
    )]: () => true,
    [combineActions(
      deleteSimulationFinished,
      deleteSimulationCanceled,
      editSimulationFinished,
      editSimulationCanceled,
      newSimulationFinished,
      newSimulationCanceled,
      deleteExecutionFinished,
      deleteExecutionCanceled,
      editExecutionFinished,
      editExecutionCanceled,
      newExecutionFinished,
      newExecutionCanceled,
    )]: () => false,
  },
  false,
);

const hikesLoading = handleActions(
  {
    [requestHikes]: () => true,
    [combineActions(receiveHikes, requestHikesFailed)]: () => false,
  },
  false,
);

const initialHikesState: ReadonlyArray<IHike> = [];
const hikes = handleActions(
  {
    [combineActions(receiveHikes, saveHikesSucceeded)]: (state, { payload }) =>
      payload || initialHikesState,
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
    [setSelectedSimulation]: (state, { payload }) => ({ ...(payload || initialSimulationState) }),
    [updateSelectedSimulation]: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
  },
  initialSimulationState,
);

const initialExecutionState = {};
const execution = handleActions(
  {
    [setSelectedExecution]: (state, { payload }) => ({ ...(payload || initialExecutionState) }),
    [updateSelectedExecution]: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
  },
  initialExecutionState,
);

const initialRenderingState = {};
const rendering = handleActions(
  {
    [setSelectedRendering]: (state, { payload }) => ({ ...(payload || initialRenderingState) }),
    [updateSelectedRendering]: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
  },
  initialRenderingState,
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
    [receiveHikes]: (state, { payload = initialHikesState }) => {
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
    [receiveHikes]: (state, { payload = initialHikesState }) => {
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
    [receiveHikes]: (state, { payload = initialHikesState }) => {
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
  execution,
  rendering,
  actionValid,
  active,
  operationPending,
  operationEnded,
});

export type EditorModuleState = ReturnType<typeof editorModuleReducer>;
export type InsertableEditorModuleReducer = typeof editorModuleReducer & InsertableReducerType;

const insertableEditorModuleReducer: InsertableEditorModuleReducer = editorModuleReducer;

insertableEditorModuleReducer.reducer = 'editor';

export default insertableEditorModuleReducer;

export interface RootEditorState {
  editor: EditorModuleState;
}

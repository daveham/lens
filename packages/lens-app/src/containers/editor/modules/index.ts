import { handleActions, combineActions } from 'redux-actions';
import { combineReducers } from 'redux';
import {
  // simulations
  finishNewSimulation,
  newSimulationFinished,
  cancelNewSimulation,
  newSimulationCanceled,
  finishEditSimulation,
  editSimulationFinished,
  cancelEditSimulation,
  editSimulationCanceled,
  finishDeleteSimulation,
  deleteSimulationFinished,
  cancelDeleteSimulation,
  deleteSimulationCanceled,
  // executions
  finishNewExecution,
  newExecutionFinished,
  cancelNewExecution,
  newExecutionCanceled,
  finishEditExecution,
  editExecutionFinished,
  cancelEditExecution,
  editExecutionCanceled,
  finishDeleteExecution,
  deleteExecutionFinished,
  cancelDeleteExecution,
  deleteExecutionCanceled,
  // renderings
  finishNewRendering,
  newRenderingFinished,
  cancelNewRendering,
  newRenderingCanceled,
  finishEditRendering,
  editRenderingFinished,
  cancelEditRendering,
  editRenderingCanceled,
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
  saveNewSimulationFailed,
  saveHikesSucceeded,
  deleteSimulationSucceeded,
  saveExecutionSucceeded,
  saveNewExecutionSucceeded,
  deleteExecutionSucceeded,
  saveRenderingSucceeded,
  saveNewRenderingSucceeded,
  deleteRenderingSucceeded,
} from './actions/data';
import {
  setErrorMessage,
  clearErrorMessage,
  clearEditor,
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
const emptyErrorMessage = '';
const errorMessage = handleActions(
  {
    [clearErrorMessage]: () => emptyErrorMessage,
    [combineActions(setErrorMessage, saveNewSimulationFailed)]: (state, { payload }) => {
      const { message } = payload;
      if (message) {
        return message;
      }
      return payload.toString();
    },
  },
  emptyErrorMessage,
);

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
    [clearEditor]: () => initialSimulationsState,
    [receiveSimulationsForSource]: (state, { payload }) => payload,
    [saveSimulationSucceeded]: (state, { payload }) =>
      state.map(s => (s.id === payload.id ? payload : s)),
    [saveExecutionSucceeded]: (state, { payload }) => {
      const simulation = state.find(s => s.id === payload.simulationId);
      const changedExecutions = simulation.executions.map(e =>
        e.id === payload.id ? payload : e,
      );
      return state.map(s =>
        s.id === payload.simulationId ? { ...simulation, executions: changedExecutions } : s,
      );
    },
    [saveRenderingSucceeded]: (state, { payload }) => {
      const simulation = state.find(s => s.id === payload.simulationId);
      const execution = simulation.executions.find(e => e.id === payload.executionId);
      const changedRenderings = execution.renderings.map(r =>
        r.id === payload.id ? payload : r,
      );
      const changedExecution = { ...execution, renderings: changedRenderings };
      const changedExecutions = simulation.executions.map(e =>
        e.id === payload.executionId ? changedExecution : e,
      );
      return state.map(s =>
        s.id === payload.simulationId ? { ...simulation, executions: changedExecutions } : s,
      );
    },
    [saveNewSimulationSucceeded]: (state, { payload }) => [...state, payload],
    [saveNewExecutionSucceeded]: (state, { payload }) => {
      const simulation = state.find(s => s.id === payload.simulationId);
      const changedExecutions = [...simulation.executions, payload];
      return state.map(s =>
        s.id === payload.simulationId ? { ...simulation, executions: changedExecutions } : s,
      );
    },
    [saveNewRenderingSucceeded]: (state, { payload }) => {
      const simulation = state.find(s => s.id === payload.simulationId);
      const execution = simulation.executions.find(e => e.id === payload.executionId);
      const changedRenderings = [...execution.renderings, payload];
      const changedExecutions = simulation.executions.map(e =>
        e.id === payload.executionId ? { ...execution, renderings: changedRenderings } : e,
      );
      return state.map(s =>
        s.id === payload.simulationId ? { ...simulation, executions: changedExecutions } : s,
      );
    },
    [deleteSimulationSucceeded]: (state, { payload: { simulationId } }) =>
      state.filter(s => s.id !== simulationId),
    [deleteExecutionSucceeded]: (state, { payload: { executionId, simulationId } }) => {
      const simulation = state.find(s => s.id === simulationId);
      const changedExecutions = simulation.executions.filter(e => e.id !== executionId);
      return state.map(s =>
        s.id === simulationId ? { ...simulation, executions: changedExecutions } : s,
      );
    },
    [deleteRenderingSucceeded]: (
      state,
      { payload: { renderingId, executionId, simulationId } },
    ) => {
      const simulation = state.find(s => s.id === simulationId);
      const execution = simulation.executions.find(e => e.id === executionId);
      const changedRenderings = execution.renderings.filter(r => r.id !== renderingId);
      const changedExecution = { ...execution, renderings: changedRenderings };
      const changedExecutions = simulation.executions.map(e =>
        e.id === executionId ? changedExecution : e,
      );
      return state.map(s =>
        s.id === simulationId ? { ...simulation, executions: changedExecutions } : s,
      );
    },
  },
  initialSimulationsState,
);

const operationPending = handleActions(
  {
    [combineActions(
      finishNewSimulation,
      cancelNewSimulation,
      finishEditSimulation,
      cancelEditSimulation,
      finishDeleteSimulation,
      cancelDeleteSimulation,
      finishNewExecution,
      cancelNewExecution,
      finishEditExecution,
      cancelEditExecution,
      finishDeleteExecution,
      cancelDeleteExecution,
      finishNewRendering,
      cancelNewRendering,
      finishEditRendering,
      cancelEditRendering,
      finishDeleteRendering,
      cancelDeleteRendering,
    )]: () => true,
    [combineActions(
      newSimulationFinished,
      newSimulationCanceled,
      editSimulationFinished,
      editSimulationCanceled,
      deleteSimulationFinished,
      deleteSimulationCanceled,
      newExecutionFinished,
      newExecutionCanceled,
      editExecutionFinished,
      editExecutionCanceled,
      deleteExecutionFinished,
      deleteExecutionCanceled,
      newRenderingFinished,
      newRenderingCanceled,
      editRenderingFinished,
      editRenderingCanceled,
      deleteRenderingFinished,
      deleteRenderingCanceled,
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
    [clearEditor]: () => initialHikesState,
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
    [saveSimulationSucceeded]: (state, { payload }) => (state.id === payload.id ? payload : state),
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
    [saveExecutionSucceeded]: (state, { payload }) => (state.id === payload.id ? payload : state),
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
    [saveRenderingSucceeded]: (state, { payload }) => (state.id === payload.id ? payload : state),
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
  errorMessage,
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
});

export type EditorModuleState = ReturnType<typeof editorModuleReducer>;
export type InsertableEditorModuleReducer = typeof editorModuleReducer & InsertableReducerType;

const insertableEditorModuleReducer: InsertableEditorModuleReducer = editorModuleReducer;

insertableEditorModuleReducer.reducer = 'editor';

export default insertableEditorModuleReducer;

export interface RootEditorState {
  editor: EditorModuleState;
}

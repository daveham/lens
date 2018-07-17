import { combineReducers } from 'redux';
import { ACTIONS } from './constants';
import { InsertableReducer } from '../../../modules/types';

const simulationNames = (state = {}, { type, payload }) => {
  if (type === ACTIONS.RECORD_PATH_NAMES && payload.simulationId) {
    const { simulationId, simulationName } = payload;
    return {
      ...state,
      [simulationId]: simulationName
    };
  }
  return state;
};

const executionNames = (state = {}, { type, payload }) => {
  if (type === ACTIONS.RECORD_PATH_NAMES && payload.executionId) {
    const { executionId, executionName } = payload;
    return {
      ...state,
      [executionId]: executionName
    };
  }
  return state;
};

const renderingNames = (state = {}, { type, payload }) => {
  if (type === ACTIONS.RECORD_PATH_NAMES && payload.renderingId) {
    const { renderingId, renderingName } = payload;
    return {
      ...state,
      [renderingId]: renderingName
    };
  }
  return state;
};

const simulationReducer: InsertableReducer = combineReducers({
  simulationNames,
  executionNames,
  renderingNames
});

simulationReducer.reducer = 'simulation';

export default simulationReducer;

import { createActions } from 'redux-actions';

export const EDITOR_ACTIONS_PREFIX_SIMULATION_SAGAS = 'editor-simulation-sagas';
export const {
  changeSimulation,
  changeHike,
  changeHikeList,
  changeTrail,
  changeTrailList,
  changeHiker,
  changeHikerList,
  changeExecution,
  changeRendering,
} = createActions(
  'CHANGE_SIMULATION',
  'CHANGE_HIKE',
  'CHANGE_HIKE_LIST',
  'CHANGE_TRAIL',
  'CHANGE_TRAIL_LIST',
  'CHANGE_HIKER',
  'CHANGE_HIKER_LIST',
  'CHANGE_EXECUTION',
  'CHANGE_RENDERING',
  {
    prefix: EDITOR_ACTIONS_PREFIX_SIMULATION_SAGAS,
  },
);

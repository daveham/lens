import { ACTIONS } from './constants';
import debugLib from 'debug';
const debug = debugLib('app:module:sources');

// reducer
export default function sources (state = [], action) {
  switch (action.type) {
    case ACTIONS.RECEIVE_CATALOG:
      debug('reducer, action:', action);
      return action.payload.sources;
    default:
      return state;
  }
}

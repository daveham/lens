import { RECEIVE_CATALOG } from './catalog';
import debugLib from 'debug';
const debug = debugLib('app:module:sources');

// reducer
export default function sources (state = [], action) {
  switch (action.type) {
    case RECEIVE_CATALOG:
      debug('reducer, action:', action);
      return action.payload.sources;
    default:
      return state;
  }
}

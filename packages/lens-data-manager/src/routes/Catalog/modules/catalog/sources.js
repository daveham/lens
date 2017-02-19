import { ACTIONS } from './constants';

export default function sources (state = [], action) {
  switch (action.type) {
    case ACTIONS.RECEIVE_CATALOG:
      return action.payload.sources;
    default:
      return state;
  }
}

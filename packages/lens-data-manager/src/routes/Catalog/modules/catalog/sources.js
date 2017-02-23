import { ACTIONS } from './constants';

const initialState = {
  ids: [],
  byIds: {}
};

export default function sources (state = initialState, action) {
  switch (action.type) {
    case ACTIONS.RECEIVE_CATALOG: {
      const { sources } = action.payload;
      const ids = sources.map(source => source.id);
      const byIds = {};
      sources.forEach(source => byIds[source.id] = source);
      return { ids, byIds };
    }
    default:
      return state;
  }
}

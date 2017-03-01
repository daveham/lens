import { ACTIONS } from './constants';

const initialState = {
  ids: [],
  byIds: {}
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ACTIONS.RECEIVE_CATALOG: {
      const { sources } = payload;
      const ids = sources.map(source => source.id);
      const byIds = {};
      sources.forEach(source => byIds[source.id] = source);
      return { ids, byIds };
    }
    default:
      return state;
  }
};

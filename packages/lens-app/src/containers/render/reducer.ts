import { InsertableReducer } from '../../modules/types';

const renderReducer: InsertableReducer = (state = {}) => {
  return state;
};

renderReducer.reducer = 'render';

export default renderReducer;

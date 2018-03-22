import { InsertableReducer } from '../../modules/types';

const simulationReducer: InsertableReducer = (state = {}) => {
  return state;
};

simulationReducer.reducer = 'simulation';

export default simulationReducer;

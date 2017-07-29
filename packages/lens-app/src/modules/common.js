import { combineReducers } from 'redux';
import { createAction } from 'redux-actions';

export const ACTIONS = {
  TEST_ACTION_ONE: 'TEST_ACTION_ONE',
  TEST_ACTION_TWO: 'TEST_ACTION_TWO'
};

export const testOneAction = createAction(ACTIONS.TEST_ACTION_ONE);
export const testTwoAction = createAction(ACTIONS.TEST_ACTION_TWO);

const testOne = (state = '', { type }) => {
  if (type === ACTIONS.TEST_ACTION_ONE) {
    return 'test-one';
  }
  return state;
};

const testTwo = (state = '', { type }) => {
  if (type === ACTIONS.TEST_ACTION_TWO) {
    return 'test-two';
  }
  return state;
};

export default combineReducers({
  testOne,
  testTwo
});

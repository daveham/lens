import { STORE_INJECT } from './middleware';

export function injectReducers(reducers) {
  return { [STORE_INJECT]: { reducers } };
}

import { STORE_INJECT } from './middleware';

export function injectReducers(reducers) {
  return { [STORE_INJECT]: { reducers } };
}

export function injectSagas(sagas) {
  return { [STORE_INJECT]: { sagas } };
}

export function injectCommands(commands) {
  return { [STORE_INJECT]: { commands } };
}

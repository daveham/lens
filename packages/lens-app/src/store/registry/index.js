import { combineReducers } from 'redux';

import getDebugLog from './debugLog';
const debug = getDebugLog();

export default class Registry {
  constructor({ reducers, sagas, commands }) {
    this._reducers = reducers;
    this._commands = {
      ...commands
    };
    this._sagas = { };
    if (sagas) {
      this._sagas[sagas.key] = sagas.saga;
    }
  }

  store = null;
  sagaMiddleware = null;

  inject({ reducers, sagas, commands }) {
    if (reducers) {
      Object.assign(
        this._reducers,
        reducers.reduce((acc, reducer) => {
          acc[reducer.reducer] = reducer;
          return acc;
        }, {})
      );

      debug('replacing reducers');
      this.store.replaceReducer(combineReducers(this._reducers));
    }

    if (sagas) {
      debug('injecting sagas', sagas);
      this._sagas[sagas.key] = sagas.saga;
      this.sagaMiddleware.run(sagas.saga);
    }

    if (commands) {
      debug('replacing commands');
      this._commands = {
        ...this._commands,
        ...commands
      };
    }
  }

  get initialReducers() {
    return combineReducers(this._reducers);
  }

  get sagas() {
    return this._sagas;
  }

  get commands() {
    return this._commands;
  }
}

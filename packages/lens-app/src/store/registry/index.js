import { combineReducers } from 'redux';

import _debug from 'debug';
const debug = _debug('lens:registry');

export default class Registry {
  constructor({ reducers, sagas, commands }) {
    this._reducers = reducers;
    this._sagas = sagas;
    this._commands = commands;
  }

  store = null;

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
      debug('replacing sagas');
      // TODO: manage sagas
    }

    if (commands) {
      debug('replacing commands');
      // TODO: manage commands
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

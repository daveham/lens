import { takeEvery, all, call } from 'redux-saga/effects';
import { ACTIONS } from '../modules/common';
import { registry } from '../store';

import _debug from 'debug';
const debug = _debug('lens:saga:command');

export function* routeCommandSaga({ payload }) {
  const { command } = payload;
  const handler = registry.commands[command];
  if (handler) {
    debug(`dispatching command '${command}' to handler`, { payload });
    yield call(handler, payload);
  } else {
    debug(`no handler for command '${command}'`);
  }
}

export default function* commandSaga() {
  yield all([
    takeEvery(ACTIONS.RECEIVE_SERVICE_COMMAND, routeCommandSaga)
  ]);
}

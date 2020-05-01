import { takeEvery, all, call } from 'redux-saga/effects';
import { receiveServiceCommand } from 'modules/common';
import { registry } from '../store';

import getDebugLog from './debugLog';
const debug = getDebugLog('command');

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
    takeEvery(receiveServiceCommand, routeCommandSaga)
  ]);
}

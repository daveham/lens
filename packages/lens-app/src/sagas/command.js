import { takeEvery, select, all, call } from 'redux-saga/effects';
import { ACTIONS } from '../modules/common';
import { registry } from '../store';

import _debug from 'debug';
const debug = _debug('lens:saga:command');

const tmpSelector = (state) => state.common.clientId;

export function* routeCommandSaga({ payload }) {
  const { command } = payload;
  const commands = registry.commands;
  debug('commandSaga', { command, commands });
  yield select(tmpSelector);
  const handler = commands[command];
  if (handler) {
    yield call(handler, payload);
  }
}

export default function* commandSaga() {
  yield all([
    takeEvery(ACTIONS.RECEIVE_SERVICE_COMMAND, routeCommandSaga)
  ]);
}

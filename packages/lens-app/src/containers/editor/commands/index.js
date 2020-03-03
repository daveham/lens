import { delay } from 'redux-saga/effects';

import _debug from 'debug';
const debug = _debug('lens:editor:commands');

function* runExecutionHandler(payload) {
  debug('execution run command handler', payload);
  yield delay(1000);
  debug('execution run command handler complete');
}

export default {
  runExecution: runExecutionHandler,
};

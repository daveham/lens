import { put } from 'redux-saga/effects';
import { receiveProgress } from 'editor/modules/actions/data';

// import _debug from 'debug';
// const debug = _debug('lens:editor:commands');

function* runExecutionHandler({ result: { progress } }) {
  yield put(receiveProgress({ id: progress.id, progress }))
}

function* startExecutionHandler({ result: { progress } }) {
  yield put(receiveProgress({ id: progress.id, progress }))
}

function* runExecutionPassHandler({ result: { progress } }) {
  yield put(receiveProgress({ id: progress.id, progress }))
}

function* finishExecutionHandler({ result: { progress } }) {
  yield put(receiveProgress({ id: progress.id, progress }))
}

export default {
  runExecution: runExecutionHandler,
  startExecution: startExecutionHandler,
  runExecutionPass: runExecutionPassHandler,
  finishExecution: finishExecutionHandler,
};

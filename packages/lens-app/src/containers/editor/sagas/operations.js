import { all } from 'redux-saga/effects';
import operationsSimulationsSaga from 'editor/sagas/operations/simulations';
import operationsExecutionsSaga from 'editor/sagas/operations/executions';

// import _debug from 'debug';
// const debug = _debug('lens:editor:sagas:operations');

export default function* operationsRootSaga() {
  yield all([
    operationsSimulationsSaga(),
    operationsExecutionsSaga(),
  ]);
}

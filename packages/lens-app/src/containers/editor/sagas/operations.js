import { all } from 'redux-saga/effects';
import operationsSimulationsSaga from 'editor/sagas/operations/simulations';
import operationsExecutionsSaga from 'editor/sagas/operations/executions';
import operationsRenderingsSaga from 'editor/sagas/operations/renderings';

// import getDebugLog from './debugLog';
// const debug = getDebugLog('operations');

export default function* operationsRootSaga() {
  yield all([
    operationsSimulationsSaga(),
    operationsExecutionsSaga(),
    operationsRenderingsSaga(),
  ]);
}

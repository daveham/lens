import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import Registry from './registry';
import registryMiddleware from './registry/middleware';
import reducers from '../modules';
import commands from '../modules/commands';
import sagas from '../sagas';

import getDebugLog from './debugLog';
const debug = getDebugLog();

export const registry = new Registry({ reducers, commands });

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      name: 'Lens',
      shouldCatchErrors: true,
      trace: true,
    })
    : compose;

const monitorSagaLevel = 0;

const sagaMonitor = {
  effectResolved: (effectId, result) => {
    monitorSagaLevel > 0 && debug('Effect resolved', { effectId, result });
  },
  effectTriggered: desc => {
    monitorSagaLevel > 1 && debug('Effect triggered', desc);
  },
  effectRejected: (effectId, error) => {
    monitorSagaLevel > 1 &&debug('Effect rejected', { effectId, error });
  },
  effectCancelled: effectId => {
    monitorSagaLevel > 1 && debug('Effect canceled', { effectId });
  },
  rootSagaStarted: desc => {
    monitorSagaLevel > 2 && debug('Root saga started', {
      effectId: desc.effectId,
      name: desc.saga.name || 'anonymous',
      args: desc.args,
    });
  },
  actionDispatched: () => {},
};

const sagaMiddleware = createSagaMiddleware({ sagaMonitor });

const middleware = [
  sagaMiddleware,
  registryMiddleware(registry)
];

const enhancer = composeEnhancers(applyMiddleware(...middleware));
const store = createStore(registry.initialReducers, enhancer);

registry.store = store;
registry.sagaMiddleware = sagaMiddleware;

registry.inject({ sagas });

export default store;

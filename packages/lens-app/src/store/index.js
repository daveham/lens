import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import Registry from './registry';
import registryMiddleware from './registry/middleware';
import reducers from '../modules';
import commands from '../modules/commands';
import sagas from '../sagas';

export const registry = new Registry({ reducers, commands });

const sagaMiddleware = createSagaMiddleware(registry);

const middleware = [
  sagaMiddleware,
  registryMiddleware(registry)
];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  registry.initialReducers,
  composeEnhancers(applyMiddleware(...middleware))
);

registry.store = store;
registry.sagaMiddleware = sagaMiddleware;

registry.inject({ sagas });

export default store;

import { createStore, applyMiddleware, compose } from 'redux';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import Registry from './registry';
import registryMiddleware from './registry/middleware';
import baseReducers from '../modules';

const registry = new Registry({ reducers: baseReducers });

export const history = createHistory({ basename: process.env.REACT_APP_BASENAME });

const sagaMiddleware = createSagaMiddleware();

const middleware = [
  thunk,
  sagaMiddleware,
  routerMiddleware(history),
  registryMiddleware(registry)
];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  registry.initialReducers,
  composeEnhancers(applyMiddleware(...middleware))
);

registry.store = store;
registry.sagaMiddleware = sagaMiddleware;

export default store;

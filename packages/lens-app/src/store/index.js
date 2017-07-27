import { createStore, applyMiddleware, compose } from 'redux';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';
import Registry from './registry';
import registryMiddleware from './registry/middleware';

const rootReducer = {
  router: routerReducer
};
const registry = new Registry(rootReducer);

export const history = createHistory();

const middleware = [
  thunk,
  routerMiddleware(history),
  registryMiddleware(registry)
];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  registry.initialReducers,
  composeEnhancers(applyMiddleware(...middleware))
);

registry.store = store;

export default store;

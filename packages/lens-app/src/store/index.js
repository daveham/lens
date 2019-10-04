import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import Registry from './registry';
import registryMiddleware from './registry/middleware';
import reducers from '../modules';
import commands from '../modules/commands';
import sagas from '../sagas';

// import ReactotronJs from 'reactotron-react-js';
// import Reactotron from '../ReactotronConfig';

export const registry = new Registry({ reducers, commands });

// const sagaMonitor = ReactotronJs.createSagaMonitor();
// const sagaMiddleware = createSagaMiddleware({ sagaMonitor });
const sagaMiddleware = createSagaMiddleware();

const middleware = [
  sagaMiddleware,
  registryMiddleware(registry)
];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const composeEnhancers = compose;

const store = createStore(
  registry.initialReducers,
  composeEnhancers(applyMiddleware(...middleware)),
  // composeEnhancers(applyMiddleware(...middleware), Reactotron.createEnhancer()),
);

registry.store = store;
registry.sagaMiddleware = sagaMiddleware;

registry.inject({ sagas });

export default store;

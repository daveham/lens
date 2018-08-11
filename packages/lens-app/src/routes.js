import asyncRoute from './asyncroute';

// these routes drive code splitting of: react components, redux reducers, sagas and commands

export const catalogRoute = asyncRoute({
  getComponent: () => import(/* webpackChunkName: "catalogUI" */ './containers/catalog'),
  getReducers: () => import(/* webpackChunkName: "catalogReducers" */ './containers/catalog/modules'),
  getSagas: () => import(/* webpackChunkName: "catalogSagas" */ './containers/catalog/sagas')
  // getCommands
});

export const simulationRoute = asyncRoute({
  getComponent: () => import(/* webpackChunkName: "simulationUI" */ './containers/editor'),
  getReducers: () => import(/* webpackChunkName: "simulationReducers" */ './containers/editor/modules')
//  getSagas: () => import(/* webpackChunkName: "featureASagas" */ './containers/featureA/sagas')
  // getCommands
});

export const renderRoute = asyncRoute({
  getComponent: () => import(/* webpackChunkName: "renderUI" */ './containers/render'),
  getReducers: () => import(/* webpackChunkName: "renderReducers" */ './containers/render/reducer')
  // getSagas
  // getCommands
});

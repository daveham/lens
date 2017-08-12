import asyncRoute from './asyncroute';

// these routes drive code splitting of: react components, redux reducers, sagas and commands

export const catalogRoute = asyncRoute({
  getComponent: () => import(/* webpackChunkName: "catalogUI" */ './containers/catalog'),
  getReducers: () => import(/* webpackChunkName: "catalogReducers" */ './containers/catalog/modules'),
  getSagas: () => import(/* webpackChunkName: "catalogSagas" */ './containers/catalog/sagas')
  // getCommands
});

export const featureARoute = asyncRoute({
  getComponent: () => import(/* webpackChunkName: "featureAUI" */ './containers/featureA'),
  getReducers: () => import(/* webpackChunkName: "featureAReducers" */ './containers/featureA/reducer'),
  getSagas: () => import(/* webpackChunkName: "featureASagas" */ './containers/featureA/sagas')
  // getCommands
});

export const featureBRoute = asyncRoute({
  getComponent: () => import(/* webpackChunkName: "featureBUI" */ './containers/featureB'),
  getReducers: () => import(/* webpackChunkName: "featureBReducers" */ './containers/featureB/reducer')
  // getSagas
  // getCommands
});

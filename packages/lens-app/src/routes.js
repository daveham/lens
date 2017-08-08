import asyncRoute from './asyncroute';

// these routes drive code splitting of: react components, redux reducers, sagas and commands

export const catalogRoute = asyncRoute({
  getComponent: () => import('./containers/catalog'),
  getReducers: () => import('./containers/catalog/modules'),
  getSagas: () => import('./containers/catalog/sagas')
  // getCommands
});

export const featureARoute = asyncRoute({
  getComponent: () => import('./containers/featureA'),
  getReducers: () => import('./containers/featureA/reducer')
  // getSagas
  // getCommands
});

export const featureBRoute = asyncRoute({
  getComponent: () => import('./containers/featureB'),
  getReducers: () => import('./containers/featureB/reducer')
  // getSagas
  // getCommands
});

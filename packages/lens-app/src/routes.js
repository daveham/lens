import asyncRoute from './asyncroute';

// these routes drive code splitting of: react components, redux reducers, sagas and commands

export const catalogRoute = asyncRoute({
  getComponent: () => import(/* webpackChunkName: "catalogUI" */ './containers/catalog'),
  getReducers: () => import(/* webpackChunkName: "catalogReducers" */ './containers/catalog/modules'),
  getSagas: () => import(/* webpackChunkName: "catalogSagas" */ './containers/catalog/sagas')
  // getCommands
});

export const editorRoute = asyncRoute({
  getComponent: () => import(/* webpackChunkName: "editorUI" */ './containers/editor'),
  getReducers: () => import(/* webpackChunkName: "editorReducers" */ './containers/editor/modules'),
  getSagas: () => import(/* webpackChunkName: "editorSagas" */ './containers/editor/sagas'),
  getCommands: () => import(/* webpackChunkName: "editorCommands" */ './containers/editor/commands')
});

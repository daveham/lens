import { injectReducers } from 'store/reducers';

export default (store) => ({
  path: 'catalog',
  getChildRoutes(partialNextState, cb) {
    const SourceRoute = require('./routes/Source').default;
    cb(null, [SourceRoute(store)]);
  },
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Catalog = require('./containers/CatalogContainer').default;

      const reducers = {};
      reducers.catalog = require('./modules/catalog').default;
      reducers.images = require('./modules/images').default;
      reducers.stats = require('./modules/stats').default;
      injectReducers(store, reducers);

      const registerCatalogCommands = require('./commands').default;
      registerCatalogCommands();

      cb(null, Catalog);
    }, 'catalog');
  }
});

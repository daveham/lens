import { injectReducer } from 'store/reducers';

export default (store) => ({
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Catalog = require('./containers/CatalogContainer').default;
      const catalogReducer = require('./modules/catalog').default;
      injectReducer(store, { key: 'catalog', reducer: catalogReducer });

      const imagesReducer = require('./modules/images').default;
      injectReducer(store, { key: 'images', reducer: imagesReducer });

      cb(null, Catalog);
    }, 'catalog');
  }
});

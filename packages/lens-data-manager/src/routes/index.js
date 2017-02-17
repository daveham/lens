import CoreLayout from 'layouts/CoreLayout';
import CatalogRoute from './Catalog';

export default (store) => ({
  path: '/',
  indexRoute: { onEnter: (nextState, replace) => replace('/catalog') },
  component: CoreLayout,
  childRoutes: [CatalogRoute(store)]
});

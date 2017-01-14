import CoreLayout from 'layouts/CoreLayout';
import CatalogRoute from './Catalog';

export const createRoutes = (store) => {
  return ({
    path: '/',
    component: CoreLayout,
    indexRoute: CatalogRoute(store)
  });
};

export default createRoutes;

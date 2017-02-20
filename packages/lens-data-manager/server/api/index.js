import configureCatalogApi from 'server/api/catalog';
// import configureSourceApi from './source';
import configureSourcethumbsApi from 'server/api/sourcethumbs';
import configureSourceMetadataApi from 'server/api/sourcemetadata';
import configurePingApi from 'server/api/ping';
import configureImagesApi from 'server/api/images';
import configureStatsApi from 'server/api/stats';

export function configureApi(router) {

  configureCatalogApi(router);
//  configureSourceApi(router);
  configureSourcethumbsApi(router);
  configureSourceMetadataApi(router);
  configurePingApi(router);
  configureImagesApi(router);
  configureStatsApi(router);
}

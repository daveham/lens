import configureCatalogApi from 'api/catalog';
// import configureSourceApi from './source';
import configureSourcethumbsApi from 'api/sourcethumbs';
import configureSourceMetadataApi from 'api/sourcemetadata';
import configurePingApi from 'api/ping';
import configureImagesApi from 'api/images';

export function configureApi(router) {

  configureCatalogApi(router);
//  configureSourceApi(router);
  configureSourcethumbsApi(router);
  configureSourceMetadataApi(router);
  configurePingApi(router);
  configureImagesApi(router);
}

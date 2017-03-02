import _debug from 'debug';
const debug = _debug('app:catalog-commands-image');

import { receiveImageAction } from 'routes/Catalog/modules/catalog/images/actions';

export default (payload, dispatch) => {
  debug('imageCommandHandler', { payload });
  const { id, url } = payload;
  if (url) {
    debug('image has been generated', { url });
    dispatch(receiveImageAction({ imageDescriptor: id, url }));
  } else {
    debug('image was not generated');
  }
};

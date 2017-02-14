import _debug from 'debug';
const debug = _debug('app:catalog-commands');

import { injectCommandHandler } from 'commands';
import { receiveImageAction } from 'routes/Catalog/modules/images/actions';

const thumbnailCommandHandler = (payload, dispatch) => {
  debug('thumbnailCommandHandler', { payload });
  const { id, url } = payload;
  if (url) {
    debug('image has been generated', { url });
    dispatch(receiveImageAction({ imageDescriptor: id, url }));
  } else {
    debug('image was not generated');
  }
};

export default () => {
  injectCommandHandler('thumbnail', thumbnailCommandHandler);
};

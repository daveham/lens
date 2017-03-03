import _debug from 'debug';
const debug = _debug('app:catalog-commands-stats');

import { receiveStatsAction } from 'routes/Catalog/modules/catalog/stats/actions';

export default (payload, dispatch) => {
  debug('statsCommandHandler', { payload });
  const { sd, data } = payload;
  if (data) {
    debug('stats have been generated', { data });
    dispatch(receiveStatsAction({ statsDescriptor: sd, data }));
  } else {
    debug('stats were not generated');
  }
};

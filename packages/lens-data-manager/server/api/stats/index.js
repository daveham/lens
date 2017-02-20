import { queue as Queue } from 'node-resque';
import { createStats } from '@lens/data-jobs';
import config from 'config';

import _debug from 'debug';
const debug = _debug('srv:api-stats');

export default function configureApi(router) {
  debug('configure api post /stats');

  router.route('/stats')
    .post((req, res /*, next */) => {
      const sd = req.body;
      debug('POST body (sd)', { sd });

      const queue = new Queue({ connection: config.queue_connection });
      queue.on('error', (error) => { debug(error); });
      queue.connect(() => {
        const payload = createStats(sd);
        debug('enqueuing job', { payload });
        queue.enqueue(config.queue_name, payload.command, payload);
        res.json(payload);
      });
    });
}

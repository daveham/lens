import { queue as Queue } from 'node-resque';
import { createPing } from '@lens/data-jobs';
import config from 'config';

import _debug from 'debug';
const debug = _debug('srv:api-ping');

export default function configureApi(router) {
  debug('configure api post /ping');
  router.route('/ping')
    .post((req, res /*, next */) => {
      debug('performing ping via task');

      const queue = new Queue({ connection: config.queue_connection });
      queue.on('error', (error) => { debug(error); });
      queue.connect(() => {
        const payload = createPing();
        queue.enqueue(config.queue_name, payload.command, payload);
        res.json(payload);
      });
    });
}

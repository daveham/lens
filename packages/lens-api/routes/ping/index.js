import { queue as Queue } from 'node-resque';
import { createPing } from '@lens/data-jobs';
import config from '../../config';

import _debug from 'debug';
const debug = _debug('lens:api-ping');

export default {
  post: (req, res, next) => {
    const { clientId } = req.body;
    debug('performing ping via task', clientId);

    const queue = new Queue({ connection: config.queue_connection });
    queue.on('error', (error) => { debug(error); });
    queue.connect(() => {
      const payload = createPing(clientId);
      queue.enqueue(config.queue_name, payload.command, payload);
      debug('post ping payload', payload);
      res.send(payload);
      next();
    });
  }
};

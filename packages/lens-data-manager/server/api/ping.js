import { queue as Queue } from 'node-resque';
import { createPing } from '@lens/data-jobs';
const debug = require('debug')('srv:api-ping');

export default function configureApi(router) {
  debug('configure api post /ping');
  router.route('/ping')
    .post((req, res /*, next */) => {
      debug('performing ping via task');

      const connectionDetails = {
        pkg: 'ioredis',
        host: '127.0.0.1',
        password: null,
        port: 6379,
        database: 0
      };
      const queue = new Queue({ connection: connectionDetails });
      queue.on('error', (error) => { debug(error); });
      queue.connect(() => {
        const payload = createPing();
        queue.enqueue('il', payload.command, payload);
        res.json(payload);
      });
    });
}

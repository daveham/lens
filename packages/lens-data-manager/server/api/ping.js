import { queue as Queue } from 'node-resque';
const debug = require('debug')('app:api-ping');

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
        queue.enqueue('il', 'ping');
        res.json({ msg: 'enqueued' });
      });
    });
}

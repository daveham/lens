import fs from 'fs';
import { queue as Queue } from 'node-resque';
import { pathFromImageDescriptor, urlFromImageDescriptor } from './utils';

const connectionDetails = {
  pkg: 'ioredis',
  host: '127.0.0.1',
  password: null,
  port: 6379,
  database: 0
};

const debug = require('debug')('app:api-images');

export default function configureApi(router) {
  debug('configure api post /images');

  router.route('/images')
    .post((req, res /*, next */) => {
      const id = req.body;
      const path = pathFromImageDescriptor(id);
      debug('POST images', { path });

      fs.access(path, fs.constants.R_OK, (err) => {
        if (err) {
          if (err.code === 'ENOENT') {
            debug('file does not exist - creating task');
            const queue = new Queue({ connection: connectionDetails });
            queue.on('error', (error) => { debug(error); });
            queue.connect(() => {
              queue.enqueue('il', 'ping'); // TODO: image thumbnail task
              res.json({ task: 'xyzzy' });
            });
          } else {
            debug('file access error', err);
            res.json({ error: err });
          }
        } else {
          debug('file exists');
          res.json({ url: urlFromImageDescriptor(id) });
        }
      });
    });
}

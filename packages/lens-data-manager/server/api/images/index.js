import fs from 'fs';
import { queue as Queue } from 'node-resque';
import { pathFromImageDescriptor, urlFromImageDescriptor } from '@lens/image-descriptors';
import { createThumbnail } from '@lens/data-jobs';
import config from 'config';

import _debug from 'debug';
const debug = _debug('srv:api-images');

export default function configureApi(router) {
  debug('configure api post /images');

  router.route('/images')
    .post((req, res /*, next */) => {
      const id = req.body;
      debug('POST body (id)', { id });
      const path = pathFromImageDescriptor(id);
      debug('POST images', { path });

      fs.access(path, fs.constants.R_OK, (err) => {
        if (err) {
          if (err.code === 'ENOENT') {
            debug('file does not exist - creating task');
            const queue = new Queue({ connection: config.queue_connection });
            queue.on('error', (error) => { debug(error); });
            queue.connect(() => {
              const payload = createThumbnail(id);
              queue.enqueue(config.queue_name, payload.command, payload);
              res.json(payload);
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

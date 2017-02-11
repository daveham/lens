import gm from 'gm';
import config from 'config';
import { pathFromImageDescriptor, urlFromImageDescriptor } from '@lens/image-descriptors';
const debug = require('debug')('svc:jobs-thumbnail');
//import app from 'server/app';

const defineJob = (jobs) => {
  jobs.thumbnail = {
    perform: (job, cb) => {
      const { jobId, timestamp } = job;
      debug('thumbnail perform', { jobId, timestamp });
      debug(`I want to generate a thumbnail for source with id ${job.id.source.id} and file ${job.id.source.file}`);
      debug(`After it is generated, I need to report its url as ${urlFromImageDescriptor(job.id)}`);

      const sourceFile = config.utils_paths.sources(job.id.source.file);
      const destFile = config.utils_paths.thumbs(pathFromImageDescriptor(job.id));
      debug(`source file should be ${sourceFile} and dest file should be ${destFile}`);

      gm(sourceFile).thumb(100, 100, destFile, 80, (err, gmdata) => {
        if (err) {
          debug('gm thumb error', { err });
          return cb();
        }
        debug('gm thumb success', { gmdata });
        cb();
      });
    }
  };
};

//      if (app) {
//        const socket = app.get('socket');
//        debug('ping job duration', Date.now() - timestamp);
//        const result = {
//          ...job,
//          command: 'pong',
//          timestamp: Date.now()
//        };
//        socket.emit('job', result);
//      }

export default defineJob;

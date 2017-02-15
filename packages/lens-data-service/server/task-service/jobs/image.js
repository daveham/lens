import gm from 'gm';
import config from 'config';
import { pathFromImageDescriptor, urlFromImageDescriptor } from '@lens/image-descriptors';
const debug = require('debug')('svc:jobs-thumbnail');
import app from 'server/app';

const defineJob = (jobs) => {
  jobs.image = {
    perform: (job, cb) => {
      const { jobId, timestamp } = job;
      debug('thumbnail perform', { jobId, timestamp });
      debug(`I want to generate a thumbnail for source with id ${job.id.source.id} and file ${job.id.source.file}`);
      debug(`After it is generated, I need to report its url as ${urlFromImageDescriptor(job.id)}`);

      const sourceFile = config.utils_paths.sources(job.id.source.file);
      const destFile = config.utils_paths.thumbs(pathFromImageDescriptor(job.id));
      debug(`source file should be ${sourceFile} and dest file should be ${destFile}`);

      gm(sourceFile).thumb(100, 100, destFile, 80, (err, gmdata) => {
        if (app) {
          const socket = app.get('socket');
          const result = {
            ...job,
            timestamp: Date.now()
          };
          debug('thumbnail job duration', result.timestamp - timestamp);

          if (err) {
            debug('gm thumb error', { err });
            result.status = 'error';
          } else {
            debug('gm thumb success', { gmdata });
            result.status = 'complete';
            result.url = urlFromImageDescriptor(job.id);
          }
          socket.emit('job', result);
          cb();
        }
      });
    }
  };
};


export default defineJob;

import { worker as Worker } from 'node-resque';
import loadCatalog from './jobs/utils/loadCatalog';

import _debug from 'debug';
const debug = _debug('lens:worker');

const start = (connection, queues, context, jobs, cb) => {
  const timeout = process.env.WORKER_TIMEOUT || 1000;
  const worker = new Worker({ timeout, connection, queues, context }, jobs);

  worker.on('start', () => {
    debug('worker started, loading catalog into redis');
    loadCatalog(worker.options.context);
  });

  // worker.on('pause',
  //   () => {
  //     debug('paused');
  //   }
  // );

  worker.on('end', () => {
    debug('ended');
  });

  worker.on('error', (queue, job, error) => {
    debug(`error ${queue} ${JSON.stringify(job)} >> ${error}`);
  });

  worker.on('cleaning_worker', (worker /* , pid */) => {
    debug(`cleaning old worker ${worker}`);
  });

  // worker.on('poll', (queue) => { debug(`polling ${queue}`); });

  worker.on('job', (queue, job) => {
    debug(`${job.queue}/${job.class}`);
    const params = job.args[0];
    params.started = Date.now();
    params.waited = params.started - params.created;
  });

  worker.on('reEnqueue', (queue, job, plugin) => {
    debug(`reEnqueue job (${plugin}) ${queue} ${JSON.stringify(job)}`);
  });

  worker.on('success', (queue, job /* , result */) => {
    debug(`${job.queue}/${job.class} success`);
  });

  worker.on('failure', (queue, job, failure) => {
    debug(`job failure ${queue} ${JSON.stringify(job)} >> ${failure}`);
  });

  worker.connect(() => {
    worker.workerCleanup(); // optional: cleanup any previous improperly shutdown workers on this host
    worker.start();
    cb(worker);
  });
};

export default start;

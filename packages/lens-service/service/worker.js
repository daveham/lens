import { Worker } from 'node-resque';
import loadCatalog from './jobs/utils/loadCatalog';

import getDebugLog from './debugLog';
const debug = getDebugLog('worker');

const start = async (connection, queues, jobs) => {
  const timeout = process.env.WORKER_TIMEOUT || 1000;
  debug('creating worker');
  const worker = new Worker({ timeout, connection, queues }, jobs);

  worker.on('start', () => {
    debug('worker started, loading catalog into redis');
    loadCatalog();
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
    // params.context = context;
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

  await worker.connect();
  await worker.start();

  // cleanup any previous improperly shutdown workers on this host
  // worker.workerCleanup(); // optional:
  return worker;
};

export default start;

import config from 'config';
import jobs from './jobs';
import startWorker from './worker';

const start = cb => {
  startWorker(config.queue_connection, [config.queue_name], jobs, cb);
};

export default start;

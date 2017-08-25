import config from '../config';
import jobs from './jobs';
import startWorker from './worker';

const start = (getSocket, cb) => {
  startWorker(config.queue_connection, [config.queue_name], getSocket, jobs, cb);
};

export default start;

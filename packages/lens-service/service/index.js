import config from '../config';
import jobs from './jobs';
import startWorker from './worker';

const start = (context, cb) => {
  startWorker(context.queue_connection, [config.queue_name], context, jobs, cb);
};

export default start;

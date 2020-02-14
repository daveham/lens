import config from '../config';
import jobs from './jobs';
import startWorker from './worker';

const start = (context, cb) => {
  startWorker(context.queueConnection, [config.queueName], context, jobs, cb);
};

export default start;

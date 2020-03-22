import config from '../config';
import jobs from './jobs';
import startWorker from './worker';
import context from '../server/context';

const start = async () =>
  startWorker(context.queueConnection, [config.queueName], jobs);

export default start;

import config from '../config';
import jobs from './jobs';
import startWorker from './worker';
import { getResqueClient } from '../server/context';

const start = async () =>
  startWorker({ redis: getResqueClient() }, [config.queueName], jobs);

export default start;

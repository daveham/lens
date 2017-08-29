import { sendResponse } from '../../worker';

export default (jobs) => {
  jobs.ping = {
    perform: (job, cb) => {
      sendResponse({
        ...job,
        command: 'pong'
      });
      cb();
    }
  };
};

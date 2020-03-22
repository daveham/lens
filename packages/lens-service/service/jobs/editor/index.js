import co from 'co';
import { respond, respondWithError } from '../../../server/context';

import _debug from 'debug';
const debug = _debug('lens:editor');

const delayJobStep = (delay) => {
  return new Promise((resolve) => setTimeout(() => resolve(), delay));
};

function* runExecutionGenerator(job) {
  const { payload, ...parameters } = job;
  debug('perform runExecution', { parameters });
  yield delayJobStep(1000);
  respond(job, { message: 'step one' });
  yield delayJobStep(2000);
  respond(job, { message: 'step two' });
  yield delayJobStep(3000);
  respond(job, { message: 'step three' });

  yield Promise.resolve(true);
}

const editor = jobs => {
  jobs.runExecution = {
    perform: async job => {
      return co(runExecutionGenerator(job))
        .catch(error => {
          respondWithError(job, error);
        });
    },
  };
};

export default (jobs) => {
  editor(jobs);
};

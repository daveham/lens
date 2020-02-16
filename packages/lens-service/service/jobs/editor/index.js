import co from 'co';
import captureContextPlugin from '../utils/captureContextPlugin';

import _debug from 'debug';
const debug = _debug('lens:editor');

const delayJobStep = (delay) => {
  return new Promise((resolve) => setTimeout(() => resolve(), delay));
};

function* generator(job, context) {
  yield delayJobStep(1000);
  context.respond({ ...job, message: 'step one' });
  yield delayJobStep(2000);
  context.respond({ ...job, message: 'step two' });
  yield delayJobStep(3000);
  context.respond({ ...job, message: 'step three' });

  yield Promise.resolve(true);
  return 'done';
}

const editor = jobs => {
  const capture = {};

  jobs.runExecution = {
    plugins: [captureContextPlugin],
    pluginOptions: {
      captureContextPlugin: { capture },
    },
    perform: (job, cb) => {
      debug('perform', { job });
      const { context } = capture;
      co(generator(job, context))
        .then(payload => {
          context.respond({ ...job, payload });
          cb();
        })
        .catch(error => {
          context.respondWithError(error, job);
          cb();
        });
    },
  };
};

export default (jobs) => {
  editor(jobs);
};

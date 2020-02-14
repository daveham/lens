import co from 'co';
import captureContextPlugin from '../utils/captureContextPlugin';

import _debug from 'debug';
const debug = _debug('lens:editor');

function* generator(payload) {
  yield Promise.resolve(true);
  return payload;
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

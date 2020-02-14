import co from 'co';
import captureContextPlugin from '../utils/captureContextPlugin';
import keysRemove from '../utils/keysRemove';

function* generator(pattern, context) {
  return yield keysRemove(context.getRedisClient(), pattern);
}

export default jobs => {
  const capture = {};

  jobs.deleteStats = {
    plugins: [captureContextPlugin],
    pluginOptions: {
      captureContextPlugin: { capture },
    },
    perform: (job, cb) => {
      const { sourceId, group } = job;
      const { context } = capture;

      const pattern = `lens:h_${sourceId}_i_${group}_*`;
      co(generator(pattern, context))
        .then(data => {
          context.respond({ ...job, data });
          cb();
        })
        .catch(error => {
          context.respondWithError(error, job);
          cb();
        });
    },
  };
};

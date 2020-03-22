import co from 'co';
import keysRemove from '../utils/keysRemove';
import { getRedisClient, respond, respondWithError } from '../../../server/context';

function* generator(pattern) {
  return yield keysRemove(getRedisClient(), pattern);
}

export default jobs => {
  jobs.deleteStats = {
    perform: async job => {
      const { sourceId, group } = job;
      const pattern = `lens:h_${sourceId}_i_${group}_*`;
      return co(generator(pattern))
        .then(data => {
          respond(job, { data });
        })
        .catch(error => {
          respondWithError(job, error);
        });
    },
  };
};

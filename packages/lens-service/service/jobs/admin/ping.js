import { respond } from '../../../server/context';

export default jobs => {
  jobs.ping = {
    perform: async job => {
      respond(
        {
          ...job,
          command: 'pong',
        },
        {},
      );
    },
  };
};

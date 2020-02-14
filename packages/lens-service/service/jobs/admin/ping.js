import captureContextPlugin from '../utils/captureContextPlugin';

export default jobs => {
  const capture = {};

  jobs.ping = {
    plugins: [captureContextPlugin],
    pluginOptions: {
      captureContextPlugin: { capture },
    },
    perform: (job, cb) => {
      capture.context.respond({
        ...job,
        command: 'pong',
      });
      cb();
    },
  };
};

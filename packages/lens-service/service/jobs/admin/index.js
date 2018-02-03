import captureContextPlugin from '../utils/captureContextPlugin';

export default (jobs) => {
  const capture = {};

  jobs.ping = {
    plugins: [captureContextPlugin],
    pluginOptions: {
      captureContextPlugin: { capture }
    },
    perform: (job, cb) => {
      capture.context.sendResponse({
        ...job,
        command: 'pong'
      });
      cb();
    }
  };
};

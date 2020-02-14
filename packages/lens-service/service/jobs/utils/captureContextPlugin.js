const captureContextPlugin = function(worker, func, queue, job, args, options) {
  const self = this;
  self.name = 'captureContextPlugin';
  self.worker = worker;
  self.func = func;
  self.queue = queue;
  self.job = job;
  self.args = args;
  self.options = options;
};

captureContextPlugin.prototype.before_perform = function(callback) {
  this.options.capture.context = this.worker.options.context;
  callback(null, true);
};

export default captureContextPlugin;

let jobCounter = 0;

export const createJob = (command, payload = {}) => {
  payload.jobId = ++jobCounter;
  payload.command = command;
  payload.created = Date.now();
  return payload;
};

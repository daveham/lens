let jobCounter = 0;

export const createJob = (command, payload = {}) => {
  payload.id = ++jobCounter;
  payload.command = command;
  payload.timestamp = Date.now();
  return payload;
};

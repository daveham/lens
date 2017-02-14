import _debug from 'debug';
const debug = _debug('app:commands');

const nullHandler = () => {
  debug('nullHandler');
};

const handlers = {
  default: nullHandler
};

export const injectCommandHandler = (key, handler) => {
  if (handlers[key]) {
    debug(`warning: replacing exising handler at key '${key}'`);
  }
  handlers[key] = handler;
};

export const handleCommand = (key, payload, dispatch) => {
  const handler = handlers[key] || handlers.default;
  return handler(payload, dispatch);
};

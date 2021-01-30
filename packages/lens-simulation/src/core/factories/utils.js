// import getDebugLog from './debugLog';
// const debug = getDebugLog('utils');

export function extractTypeAndOptions({ type, options, ...other }) {
  return [type, options, other];
}

export function getEndType({ type }) {
  const types = type.split(':');
  return types[types.length - 1];
}

export function makeSuspendListKey(type, id) {
  return `${type}.${id}`;
}

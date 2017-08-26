import { call, put } from 'redux-saga/effects';

import _debug from 'debug';
const debug = _debug('lens:utils');

const apiServer = process.env.REACT_APP_REST_SERVER || 'http://localhost:3001';

const defaultHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

export const invokeRestService = (url, options = {}) => {
  const method = options.method || 'GET';
  const headers = options.headers || defaultHeaders;

  const fetchParams = { method, headers };
  if (method !== 'GET') {
    const rawBody = options.body || {};
    fetchParams.body = JSON.stringify(rawBody);
  }

  return fetch(apiServer + url, fetchParams)
  .then(response => response.json())
  .then(payload => {
    return payload;
  })
  .catch(error => {
    debug('getAPI error', { url, error });
    throw error;
  });
};

export function* apiSaga(fn, args, successAction, errorAction) {
  try {
    const payload = yield call(fn, ...args);
    yield put(successAction(payload));
  } catch (error) {
    yield put(errorAction(error));
  }
}

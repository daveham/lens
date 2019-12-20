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
  .then((response) => {
    debug('fetch response', response);
    if (response.status >= 300) {
      throw new Error(`Server status ${response.status}: ${response.statusText}`);
    }
    return response.json();
  })
  .then(payload => payload)
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
    debug('apiSaga', { error });
    yield put(errorAction(error));
  }
}

export function invokeRestApi(url, options = {}) {
  const method = options.method || 'GET';
  const headers = options.headers || defaultHeaders;

  const fetchParams = { method, headers };
  if (method !== 'GET') {
    const body = options.body || {};
    fetchParams.body = JSON.stringify(body);
  }

  return fetch(apiServer + url, fetchParams)
}

export function* restApiSaga(args, successAction, errorAction) {
  try {
    const response = yield call(invokeRestApi, ...args);
    if (response.status >= 200 && response.status < 300) {
      const data = yield response.json();
      yield put(successAction(data));
    } else {
      debug('restApiSaga - failed status', { status: response.status });
      throw response;
    }
  }
  catch (error) {
    debug('restApiSaga', { error });
    yield put(errorAction(error));
  }
}

import { call, put } from 'redux-saga/effects';

import _debug from 'debug';
const debug = _debug('lens:utils');

const apiServer = process.env.REACT_APP_REST_SERVER || 'http://localhost:3001';

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
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

  return fetch(apiServer + url, fetchParams);
}

export function* invokeRestApiReturnData(url, options) {
  const response = yield invokeRestApi(url, options);
  if (response.status >= 200 && response.status < 300) {
    return yield response.json();
  } else {
    debug('invokeRestApiReturnData - failed status', { status: response.status });
    throw response;
  }
}

export function* fnApiSaga(fn, args, successAction, errorAction) {
  try {
    const data = yield* invokeRestApiReturnData(...args);
    yield put(successAction(data));
  } catch (error) {
    debug('fnApiSaga', { error });
    yield put(errorAction(error));
  }
}

export function* restApiSaga(args, successAction, errorAction) {
  yield* fnApiSaga(invokeRestApi, args, successAction, errorAction);
}

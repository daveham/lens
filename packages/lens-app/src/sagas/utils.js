import { call, put } from 'redux-saga/effects';

import getDebugLog from './debugLog';
const debug = getDebugLog('utils');

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
    const data = yield response.text();
    return data ? JSON.parse(data) : {};
  } else {
    debug('invokeRestApiReturnData - failed status', { status: response.status });
    throw response;
  }
}

export function* fnApiSaga(args, successAction, errorAction) {
  try {
    const data = yield* invokeRestApiReturnData(...args);
    yield put(successAction(data));
  } catch (error) {
    debug('fnApiSaga', { error });
    yield put(errorAction(error));
  }
}

export function* restApiSaga(args, successAction, errorAction) {
  yield* fnApiSaga(args, successAction, errorAction);
}

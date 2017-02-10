import { createAction } from 'redux-actions';
import fetch from 'isomorphic-fetch';

import { ACTIONS } from './constants';

import _debug from 'debug';
const debug = _debug('app:module:service-actions');

const socketHost = process.env.SOCKET_HOST;

// actions
const requestServiceConnect = createAction(ACTIONS.SERVICE_CONNECT);
const receiveServiceConnected = createAction(ACTIONS.SERVICE_CONNECTED);
const serviceFailed = createAction(ACTIONS.SERVICE_FAILED);

export const connectService = () => {
  return (dispatch /*, getState */) => {
    // TODO: make this return a promise
    dispatch(requestServiceConnect());
    if (typeof io === 'undefined') {
      debug('io not defined, service probably not running');
      dispatch(serviceFailed());
      return;
    }

    // connect to lens-data-service, primarily for socket notifications
    const socket = io.connect(socketHost);
    socket.on('connect', () => {
      debug('connected');
      dispatch(receiveServiceConnected({ socket }));
    });
    socket.on('disconnect', () => {
      debug('disconnected');
    });
    socket.on('reconnect', () => {
      debug('reconnected');
    });
    socket.on('error', err => {
      debug('error', err);
    });

    socket.on('flash', payload => {
      debug('socket flash message', { payload });
      dispatch(receiveServiceMessage(payload));
    });

    socket.on('job', payload => {
      debug('socket job message', { payload });
      dispatch(receiveServiceMessage(payload));
    });
  };
};

const sendServiceMessage = createAction(ACTIONS.SEND_SERVICE_MESSAGE);
export const receiveServiceMessage = createAction(ACTIONS.RECEIVE_SERVICE_MESSAGE);

const fetchHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};

let flashCounter = 0;

export const sendServiceCommand = (command, servicePath, body = {}) => {
  return (dispatch, getState) => {
    if (servicePath === 'flash') {
      // send command to the server directly over the socket
      const { socket } = getState().service;
      const payload = { flashId: flashCounter++, command, timestamp: Date.now(), body };
      dispatch(sendServiceMessage(payload));
      debug('sendServiceCommand(flash)', { payload });
      socket.emit('flash', payload);
    } else {
      // otherwise use the api to enqueue a job
      return fetch(servicePath, { method: 'POST', body: JSON.stringify(body), headers: fetchHeaders })
        .then(
          (response) => { return response.json(); },
          (error) => { return { error }; }
        )
        .then(
          (json) => {
            const payload = { command, jobId: json.jobId };
            if (json.error) {
              payload.status = 'error';
              payload.data = json.error;
              dispatch(receiveServiceMessage(payload));
            }
            debug('json response from post to api', { json });
            return dispatch(sendServiceMessage(payload));
          }
        );
    }
  };
};

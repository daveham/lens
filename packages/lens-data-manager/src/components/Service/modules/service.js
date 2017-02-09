import { createAction } from 'redux-actions';
import fetch from 'isomorphic-fetch';
import _debug from 'debug';
const debug = _debug('app:module:service');

const socketHost = process.env.SOCKET_HOST;

const SERVICE_CONNECT = 'SERVICE_CONNECT';
const SERVICE_CONNECTED = 'SERVICE_CONNECTED';
const SERVICE_FAILED = 'SERVICE_FAILED';
const SEND_SERVICE_MESSAGE = 'SEND_SERVICE_MESSAGE';
const RECEIVE_SERVICE_MESSAGE = 'RECEIVE_SERVICE_MESSAGE';

// actions
const requestServiceConnect = createAction(SERVICE_CONNECT);
const receiveServiceConntected = createAction(SERVICE_CONNECTED);
const serviceFailed = createAction(SERVICE_FAILED);
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
      dispatch(receiveServiceConntected({ socket }));
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

const sendServiceMessage = createAction(SEND_SERVICE_MESSAGE);
export const receiveServiceMessage = createAction(RECEIVE_SERVICE_MESSAGE);

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

// reducers
export default (state = {}, action) => {
  switch (action.type) {
    case SERVICE_CONNECT:
      return {
        ...state,
        connecting: true
      };

    case SERVICE_CONNECTED:
      return {
        ...state,
        connecting: false,
        socket: action.payload.socket
      };

    case SERVICE_FAILED:
      return {
        ...state,
        connecting: false,
        serviceError: 'service not available'
      };

    case SEND_SERVICE_MESSAGE: {
      const { jobId, flashId, command, status } = action.payload;
      let lastSent = `${command}.${jobId || flashId}`;
      if (status) {
        lastSent = `${lastSent}-${status}`;
      }
      return {
        ...state,
        lastSent
      };
    }

    case RECEIVE_SERVICE_MESSAGE: {
      const { jobId, flashId, command, status } = action.payload;
      let lastReceived = `${command}.${jobId || flashId}`;
      if (status) {
        lastReceived = `${lastReceived}-${status}`;
      }
      return {
        ...state,
        lastReceived
      };
    }

    default:
      return state;
  }
};

import { createAction } from 'redux-actions';
import fetch from 'isomorphic-fetch';
import _debug from 'debug';
const debug = _debug('app:module:service');

import { configureCommandHandlers } from './commands';

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

    // connect to ilgmsvc, primarily for socket notificataions
    const socket = io.connect('http://localhost:3001/');
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
    configureCommandHandlers(socket, dispatch);
  };
};

const sendServiceMessage = createAction(SEND_SERVICE_MESSAGE);
export const receiveServiceMessage = createAction(RECEIVE_SERVICE_MESSAGE);
export const sendServiceCommand = (message, data) => {
  return (dispatch, getState) => {
    switch (message) {
      case 'il-ping':
        if (data === 'socket') {
          // in 'socket' mode, ping the task server directly
          const { socket } = getState().service;
          dispatch(sendServiceMessage({ message }));
          socket.emit(message);
        } else {
          // otherwise assume 'task' mode, use an api call to enqueue a task to respond to the ping
          const body = JSON.stringify({ category: data });
          const headers = {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          };
          return fetch('/api/ping', { method: 'POST', body, headers })
            .then(
              (response) => { return response.json(); },
              (error) => { return { error }; }
            )
            .then(
              (json) => {
                if (json.error) {
                  dispatch(receiveServiceMessage({ message: json.error, data: { status: 'error' } }));
                }
                return dispatch(sendServiceMessage({ message }));
              }
            );
        }
        break;

      default:
        dispatch(sendServiceMessage({ message: 'unsupported' }));
        debug('unsupported command', message);
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

    case SEND_SERVICE_MESSAGE:
      return {
        ...state,
        lastSent: action.payload.message
      };

    case RECEIVE_SERVICE_MESSAGE: {
      let { message } = action.payload;
      const { data } = action.payload;
      if (data && data.status) {
        message = `${message}/${data.status}`;
      }
      return {
        ...state,
        lastReceived: `${message}`
      };
    }
    default:
      return state;
  }
};

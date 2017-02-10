import { ACTIONS } from './constants';

// reducers
export default (state = {}, { type, payload }) => {
  switch (type) {
    case ACTIONS.SERVICE_CONNECT:
      return {
        ...state,
        connecting: true
      };

    case ACTIONS.SERVICE_CONNECTED:
      return {
        ...state,
        connecting: false,
        socket: payload.socket
      };

    case ACTIONS.SERVICE_FAILED:
      return {
        ...state,
        connecting: false,
        serviceError: 'service not available'
      };

    case ACTIONS.SEND_SERVICE_MESSAGE: {
      const { jobId, flashId, command, status } = payload;
      let lastSent = `${command}.${jobId || flashId}`;
      if (status) {
        lastSent = `${lastSent}-${status}`;
      }
      return {
        ...state,
        lastSent
      };
    }

    case ACTIONS.RECEIVE_SERVICE_MESSAGE: {
      const { jobId, flashId, command, status } = payload;
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

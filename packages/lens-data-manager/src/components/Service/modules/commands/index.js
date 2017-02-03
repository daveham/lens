import { receiveServiceMessage, sendServiceCommand } from '../service';
import _debug from 'debug';
const debug = _debug('app:module:service:commands');

export const configureCommandHandlers = (socket, dispatch) => {

  socket.on('flash', data => {
    debug('socket on flash', { data });
    dispatch(receiveServiceMessage(data));
  });

  socket.on('job', data => {
    debug('job', { data });
    dispatch(receiveServiceMessage(data));
  });
};

export const sendPingCommand = (channel) => {
  const ping = 'ping';
  return sendServiceCommand(ping, channel);
};

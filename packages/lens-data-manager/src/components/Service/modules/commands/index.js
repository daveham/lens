import { receiveServiceMessage, sendServiceCommand } from '../service';
import _debug from 'debug';
const debug = _debug('app:module:service:commands');

export const configureCommandHandlers = (socket, dispatch) => {

  const pong = 'il-pong';
  socket.on(pong, data => {
    debug(pong, data);
    dispatch(receiveServiceMessage({ message: pong, data }));
  });

};

export const sendPingCommand = (data) => {
  const ping = 'il-ping';
  return sendServiceCommand(ping, data);
};

import { receiveServiceMessage, sendServiceCommand } from '../service';
import _debug from 'debug';
const debug = _debug('app:module:service:commands');

export const configureCommandHandlers = (socket, dispatch) => {

  const pong = 'il-pong';
  socket.on(pong, data => {
    debug(pong, data);
    dispatch(receiveServiceMessage({ message: 'pong', data }));
  });

  socket.on('il-job-complete', data => {
    debug('il-job-complete', { data });
    dispatch(receiveServiceMessage({ command: data.command, jobId: data.jobId }));
  });
};

export const sendPingCommand = (channel) => {
  const ping = 'ping';
  return sendServiceCommand(ping, channel);
};

import { sendServiceCommand } from '../service';

export const sendPingCommand = (channel) => {
  const servicePath = channel === 'job' ? '/api/ping' : channel;
  return sendServiceCommand('ping', servicePath);
};

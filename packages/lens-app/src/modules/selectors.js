export const connecting = ({ common }) => common.connecting;
export const connected = ({ common }) => {
  const { id, status } = common.socketStatus;
  return Boolean(id) && (status === 'connect' || (status === 'reconnect'));
};
export const socketId = ({ common }) => common.socketStatus.id;
export const isSocketInErrorState = ({ common }) => common.socketStatus.status === 'error';
export const command = ({ common }) => common.command;
export const clientId = ({ common }) => common.clientId;

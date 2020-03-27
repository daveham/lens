export const connecting = ({ common }) => common.connecting;
export const connected = ({ common }) => Boolean(common.socketStatus.id);
export const socketId = ({ common }) => common.socketStatus.id;
export const command = ({ common }) => common.command;
export const clientId = ({ common }) => common.clientId;

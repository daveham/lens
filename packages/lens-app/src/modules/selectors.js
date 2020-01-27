export const connecting = ({ common }) => common.connecting;
export const connected = ({ common }) => Boolean(common.socketId);
export const socketId = ({ common }) => common.socketId;
export const command = ({ common }) => common.command;
export const clientId = ({ common }) => common.clientId;

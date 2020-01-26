import { createSelector } from 'reselect';

export const commonSelector = ({ common }) => common;
export const connecting = createSelector(commonSelector, common => common.connecting);
export const socketSelector = createSelector(commonSelector, ({ socket }) => socket);
export const connected = createSelector(socketSelector, socket => Boolean(socket));
export const socketId = createSelector(socketSelector, socket => socket ? socket.id : null);
export const command = createSelector(commonSelector, ({ command }) => command);

import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import Dashboard from './components/dashboard';

import {
  requestSocket as connectSocket,
  sendSocketCommand,
  sendPing
} from 'modules/common';

const mapDispatchToProps = {
  connectSocket,
  sendSocketCommand,
  sendPing
};

const commonSelector = ({ common }) => common;
const connecting = createSelector(commonSelector, common => common.connecting);
const socketSelector = createSelector(commonSelector, ({ socket }) => socket);
const connected = createSelector(socketSelector, socket => Boolean(socket));
const socketId = createSelector(socketSelector, socket => socket ? socket.id : null);
const command = createSelector(commonSelector, ({ command }) => command);

const mapStateToProps = createStructuredSelector({ connected, connecting, socketId, command });

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));

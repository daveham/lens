import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import View from './components/view';

import {
  requestSocket as connectSocket,
  testOneAction as fetchTestOne,
  testTwoAction as fetchTestTwo,
  sendSocketCommand,
  sendPing
} from '../../modules/common';

const mapDispatchToProps = {
  connectSocket,
  fetchTestOne,
  fetchTestTwo,
  sendSocketCommand,
  sendPing
};

const commonSelector = ({ common }) => common;
const connecting = createSelector(commonSelector, common => common.connecting);
const socketSelector = createSelector(commonSelector, ({ socket }) => socket);
const connected = createSelector(socketSelector, socket => Boolean(socket));
const socketId = createSelector(socketSelector, socket => socket ? socket.id : null);
const command = createSelector(commonSelector, ({ command }) => command);

const one = createSelector(commonSelector, ({ testOne }) => testOne);
const two = createSelector(commonSelector, ({ testTwo }) => testTwo);

const mapStateToProps = createStructuredSelector({ connected, connecting, socketId, command, one, two });

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(View));

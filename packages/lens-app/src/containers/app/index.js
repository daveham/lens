import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
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

const connected = ({ common }) => Boolean(common.socket);
const connecting = ({ common }) => common.connecting;
const socketId = ({ common }) => common.socket ? common.socket.id : null;
const one = ({ common }) => common.testOne;
const two = ({ common }) => common.testTwo;

const mapStateToProps = createStructuredSelector({ connected, connecting, socketId, one, two });

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(View));

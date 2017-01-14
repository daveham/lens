import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { connectService } from '../modules/service';
import { sendPingCommand } from '../modules/commands';

import Socket from '../components/Socket.js';

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    connect: connectService,
    ping: sendPingCommand
  }, dispatch);
};

const mapStateToProps = state => {
  const { connecting, socket, serviceError, lastSent, lastReceived } = state.service;
  return { connecting, socket, serviceError, lastSent, lastReceived };
};

export default connect(mapStateToProps, mapDispatchToProps)(Socket);

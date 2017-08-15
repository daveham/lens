import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import View from './components/view';

import {
  requestSocket as connectSocket,
  testOneAction as fetchTestOne,
  testTwoAction as fetchTestTwo,
  sendSocketCommand
} from '../../modules/common';

const mapDispatchToProps = {
  connectSocket,
  fetchTestOne,
  fetchTestTwo,
  sendSocketCommand
};

const one = ({ common }) => common.testOne;
const two = ({ common }) => common.testTwo;

const mapStateToProps = createStructuredSelector({ one, two });

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(View));

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import View from './components/view';

import {
  testOneAction as fetchTestOne,
  testTwoAction as fetchTestTwo
} from '../../modules/common';

const mapDispatchToProps = {
  fetchTestOne,
  fetchTestTwo
};

const one = ({ common }) => common.testOne;
const two = ({ common }) => common.testTwo;

const mapStateToProps = createStructuredSelector({ one, two });

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(View));

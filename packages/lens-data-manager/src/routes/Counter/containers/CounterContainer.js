import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { actions } from '../modules/counter';
import Counter from '../components/Counter.js';

const { increment, doubleAsync } = actions;
const mapDispatchToProps = {
  increment: () => increment(1),
  doubleAsync
};

const counterSelector = state => state.counter;
const mapStateToProps = createStructuredSelector({
  counter: counterSelector
});

export default connect(mapStateToProps, mapDispatchToProps)(Counter);

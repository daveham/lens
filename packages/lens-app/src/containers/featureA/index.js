import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import View from './view';
import { requestHello } from './actions';
import { greeting, loading } from './selectors';

const mapDispatchToProps = {
  requestHello
};

const mapStateToProps = createStructuredSelector({
  loading,
  greeting
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(View));

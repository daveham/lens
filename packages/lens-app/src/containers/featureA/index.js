import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import View from './view';
import { requestHello } from './reducer';

const mapDispatchToProps = {
  requestHello
};

const greeting = ({ featureA }) => featureA.greeting;
const loading = ({ featureA }) => featureA.loading;

const mapStateToProps = createStructuredSelector({
  loading,
  greeting
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(View));

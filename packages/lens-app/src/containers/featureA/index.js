import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import View from './view';
import { fetchHello } from './reducer';

const mapDispatchToProps = {
  fetchHello
};

const greeting = ({ featureA }) => featureA.greeting;
const loading = ({ featureA }) => featureA.loading;

const mapStateToProps = createStructuredSelector({
  loading,
  greeting
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(View));

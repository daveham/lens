import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import View from './components/view';
import { requestCatalog } from './modules/actions';
import {
  loading,
  loaded,
  name
} from './selectors';

const mapDispatchToProps = {
  requestCatalog
};

const mapStateToProps = createStructuredSelector({
  loading,
  loaded,
  name
});

export default connect(mapStateToProps, mapDispatchToProps)(View);

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import View from './components/view';
import { requestCatalog } from './modules';

const mapDispatchToProps = {
  fetchCatalog: requestCatalog
};

const catalog = ({ catalog }) => catalog;

const mapStateToProps = createStructuredSelector({
  catalog
});

export default connect(mapStateToProps, mapDispatchToProps)(View);

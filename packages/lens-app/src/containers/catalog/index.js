import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import View from './components/view';
import { fetchCatalog } from './modules';

const mapDispatchToProps = {
  fetchCatalog
};

const catalog = ({ catalog }) => catalog;

const mapStateToProps = createStructuredSelector({
  catalog
});

export default connect(mapStateToProps, mapDispatchToProps)(View);

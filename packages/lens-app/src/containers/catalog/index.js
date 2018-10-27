import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import View from './components/view';
import { requestCatalog } from './modules/actions';
import {
  catalogIsLoading,
  catalogIsLoaded,
  thumbnailImageDescriptors,
} from './selectors';

const mapDispatchToProps = {
  requestCatalog,
};

const mapStateToProps = createStructuredSelector({
  catalogIsLoading,
  catalogIsLoaded,
  thumbnailImageDescriptors,
});

export default connect(mapStateToProps, mapDispatchToProps)(View);

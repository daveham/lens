import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import View from './components/view';
import { requestCatalog } from './modules/actions';
import { ensureImage } from '../../modules/images/actions';
import {
  loading,
  loaded,
  name,
  sourcesArray,
  thumbnailImageDescriptorsArray,
  thumbnailUrlsSelector as thumbnailImageUrls
} from './selectors';

const mapDispatchToProps = {
  requestCatalog,
  ensureImage
};

const mapStateToProps = createStructuredSelector({
  loading,
  loaded,
  name,
  sources: sourcesArray,
  thumbnailImageDescriptors: thumbnailImageDescriptorsArray,
  thumbnailImageUrls
});

export default connect(mapStateToProps, mapDispatchToProps)(View);

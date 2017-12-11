import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import View from './components/view';
import { requestCatalog } from './modules/actions';
import { ensureImage } from '../../modules/images/actions';
import { thumbnailUrlsSelector } from '../../modules/images/selectors';
import {
  loading,
  loaded,
  thumbnailImageDescriptorsArray
} from './selectors';

const mapDispatchToProps = {
  requestCatalog,
  ensureImage
};

const mapStateToProps = createStructuredSelector({
  loading,
  loaded,
  thumbnailImageDescriptors: thumbnailImageDescriptorsArray,
  thumbnailImageUrls: thumbnailUrlsSelector
});

export default connect(mapStateToProps, mapDispatchToProps)(View);

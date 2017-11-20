import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import View from './view';
import { ensureImage } from '../../../../modules/images/actions';
import {
  loaded,
  sourcesArray,
  thumbnailImageDescriptorsArray,
  thumbnailUrlsSelector as thumbnailImageUrls
} from '../../selectors';

const mapDispatchToProps = {
  ensureImage
};

const mapStateToProps = createStructuredSelector({
  loaded,
  sources: sourcesArray,
  thumbnailImageDescriptors: thumbnailImageDescriptorsArray,
  thumbnailImageUrls
});

export default connect(mapStateToProps, mapDispatchToProps)(View);

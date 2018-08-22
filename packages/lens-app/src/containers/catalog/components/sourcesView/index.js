import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import View from './view';
import { thumbnailImagesSelector } from 'modules/images/selectors';
import { ensureImages } from 'modules/images/actions';
import {
  sources,
  catalogName,
  thumbnailImageDescriptors,
  thumbnailImageKeys
} from '../../selectors';

const mapDispatchToProps = {
  ensureImages
};

const mapStateToProps = createStructuredSelector({
  sources,
  catalogName,
  thumbnailImageDescriptors,
  thumbnailImageKeys,
  thumbnailImages: thumbnailImagesSelector
});

export default connect(mapStateToProps, mapDispatchToProps)(View);

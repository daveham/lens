import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import View from './view';
import { thumbnailImagesSelector } from 'modules/images/selectors';
import { ensureImages } from 'modules/images/actions';
import {
  sources,
  thumbnailImageDescriptors,
  thumbnailImageKeys
} from 'containers/catalog/selectors';
import { ensureCatalogTitle } from '../../modules/actions';

const mapDispatchToProps = {
  ensureImages,
  ensureCatalogTitle,
};

const mapStateToProps = createStructuredSelector({
  sources,
  thumbnailImageDescriptors,
  thumbnailImageKeys,
  thumbnailImages: thumbnailImagesSelector
});

export default connect(mapStateToProps, mapDispatchToProps)(View);

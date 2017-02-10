import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { actions as catalogActions } from '../modules/catalog/actions';
import { actions as sourceMetadataActions } from '../modules/catalog/sources-metadata/actions';
import { actions as sourceThumbsActions } from '../modules/catalog/sources-thumbs/actions';
import { actions as imagesActions } from '../modules/images/actions';

import {
  sourcesByIdSelector,
  thumbnailImageDescriptorsSelector,
  thumbnailImageUrlsSelector
} from './selectors';

import CatalogView from '../components/CatalogView.js';

const mapDispatchToProps = {
  ...catalogActions,
  ...sourceMetadataActions,
  ...sourceThumbsActions,
  ...imagesActions
};

const mapStateToProps = createStructuredSelector({
  catalog: state => state.catalog,
  images: state => state.images,
  sourcesById: sourcesByIdSelector,
  thumbnailImageDescriptors: thumbnailImageDescriptorsSelector,
  thumbnailImageUrls: thumbnailImageUrlsSelector
});

export default connect(mapStateToProps, mapDispatchToProps)(CatalogView);

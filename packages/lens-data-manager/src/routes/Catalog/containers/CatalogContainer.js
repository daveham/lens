import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { actions as catalogActions } from '../modules/catalog';
import { actions as sourceMetadataActions } from '../modules/sources-metadata';
import { actions as sourceThumbsActions } from '../modules/sources-thumbs';
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

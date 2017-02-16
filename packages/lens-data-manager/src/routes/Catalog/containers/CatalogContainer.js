import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { fetchCatalog } from '../modules/catalog/actions';
import { ensureImage } from '../modules/images/actions';

import {
  thumbnailImageDescriptorsSelector as thumbnailImageDescriptors,
  thumbnailImageUrlsSelector as thumbnailImageUrls
} from './selectors';

import CatalogView from '../components/CatalogView.js';

const mapDispatchToProps = {
  fetchCatalog,
  ensureImage
};

const mapStateToProps = createStructuredSelector({
  catalog: state => state.catalog,
  thumbnailImageDescriptors,
  thumbnailImageUrls
});

export default connect(mapStateToProps, mapDispatchToProps)(CatalogView);

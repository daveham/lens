import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { requestCatalog } from '../modules/catalog/actions';
import { ensureImage } from '../modules/catalog/images/actions';

import {
  sourcesSelector as sources,
  thumbnailImageDescriptorsSelector as thumbnailImageDescriptors,
  thumbnailUrlsSelector as thumbnailImageUrls
} from '../modules/catalog/selectors';

import CatalogView from '../components/CatalogView.js';

const mapDispatchToProps = {
  fetchCatalog: requestCatalog,
  ensureImage
};

const mapStateToProps = createStructuredSelector({
  catalog: state => state.catalog,
  sources,
  thumbnailImageDescriptors,
  thumbnailImageUrls
});

export default connect(mapStateToProps, mapDispatchToProps)(CatalogView);

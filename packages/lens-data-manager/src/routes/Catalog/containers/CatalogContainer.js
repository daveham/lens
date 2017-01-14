import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { makeThumbImageDescriptor, makeImageId } from 'utils';

import { actions as catalogActions } from '../modules/catalog';
import { actions as sourceMetadataActions } from '../modules/sources-metadata';
import { actions as sourceThumbsActions } from '../modules/sources-thumbs';
import { actions as imagesActions } from '../modules/images';
import CatalogView from '../components/CatalogView.js';

const mapDispatchToProps = {
  ...catalogActions,
  ...sourceMetadataActions,
  ...sourceThumbsActions,
  ...imagesActions
};

// selectors
const sourcesById = createSelector(
  state => state.catalog.sources,
  sources => {
    const byId = {};
    if (sources) {
      sources.forEach((source) => { byId[source.id] = source; });
    }
    return byId;
  }
);

const sourceImageIds = createSelector(
  state => state.catalog.sources,
  sources => sources.map(source => source.id)
);

const thumbnailImageDescriptors = createSelector(
  sourceImageIds,
  imageIds => imageIds.map(makeThumbImageDescriptor)
);

const thumbnailImageIds = createSelector(
  thumbnailImageDescriptors,
  descriptors => descriptors.map(makeImageId)
);

const imagesSelector = state => state.images;
const thumbnailImages = createSelector(
  [imagesSelector, thumbnailImageIds],
  (images, ids) => ids.map(id => images[id])
);

const thumbnailImageUrls = createSelector(
  thumbnailImages,
  images => images.map((image) => {
    if (image) {
      if (image.loading) {
        return '/thumbloading.png';
      } else {
        return image.url;
      }
    } else {
      return '/thumbloading.png';
    }
  })
);


const mapStateToProps = createStructuredSelector({
  catalog: state => state.catalog,
  images: state => state.images,
  sourcesById,
  thumbnailImageDescriptors,
  thumbnailImageUrls
});

export default connect(mapStateToProps, mapDispatchToProps)(CatalogView);

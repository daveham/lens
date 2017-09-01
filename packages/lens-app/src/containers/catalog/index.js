import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { makeThumbnailImageDescriptor } from '@lens/image-descriptors';
import View from './components/view';
import { requestCatalog } from './modules';

const mapDispatchToProps = {
  requestCatalog
};

const loading = ({ catalog }) => catalog.loading;
const loaded = ({ catalog }) => Boolean(catalog.name);
const name = ({ catalog }) => catalog.name;
const sources = ({ catalog }) => catalog.sources;
const sourcesAsArray = createSelector(sources, sources => {
  if (sources) {
    const { ids, byIds } = sources;
    return ids.map(id => byIds[id]);
  }
});
const thumbnailImageDescriptorsSelector = createSelector(sources, sources => {
  if (sources) {
    const { ids, byIds } = sources;
    return ids.map(id => {
      const imageDescriptor = makeThumbnailImageDescriptor(id);
      imageDescriptor.input.file = byIds[id].file;
      return imageDescriptor;
    });
  }
});

const mapStateToProps = createStructuredSelector({
  loading,
  loaded,
  name,
  sources: sourcesAsArray,
  thumbnailImageDescriptors: thumbnailImageDescriptorsSelector
});

export default connect(mapStateToProps, mapDispatchToProps)(View);

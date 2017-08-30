import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import View from './components/view';
import { requestCatalog } from './modules';

const mapDispatchToProps = {
  requestCatalog
};

const catalog = ({ catalog }) => catalog;
const loading = createSelector(catalog, ({ loading }) => loading);
const loaded = createSelector(catalog, ({ name }) => Boolean(name));
const name = createSelector(catalog, ({ name }) => name);
const sources = createSelector(catalog, ({ sources }) => sources);
const sourcesAsArray = createSelector( sources, sources => {
  if (sources) {
    const { ids, byIds } = sources;
    return ids.map(id => byIds[id]);
  }
});

const mapStateToProps = createStructuredSelector({
  loading,
  loaded,
  name,
  sources: sourcesAsArray
});

export default connect(mapStateToProps, mapDispatchToProps)(View);

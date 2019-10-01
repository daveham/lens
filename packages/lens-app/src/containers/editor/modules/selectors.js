import { createSelector } from 'reselect';

// import _debug from 'debug';
// const debug = _debug('lens:editor:modules:selectors');

export const simulationsLoadingSelector = state => state.editor.simulationsLoading;
export const simulationsSelector = state => state.editor.simulations;

export const hikesLoadingSelector = state => state.editor.hikesLoading;
export const hikesSelector = state => state.editor.hikes;

const emptyArray = [];
const orderComparer = (a, b) => a.order - b.order;
const orderedItemExtractor = ({ id, name, order }) => ({ id, name, order });
const extractOrderedItems = (items, filter) => {
  const values = Object.values(items);
  if (values.length > 0) {
    const filtered = values.filter(filter);
    if (filtered.length > 0) {
      return filtered.map(orderedItemExtractor).sort(orderComparer);
    }
  }
  return emptyArray;
};

export const orderedHikesSelector = createSelector(
  state => state.editor.hikesById,
  hikes => extractOrderedItems(hikes, h => !h.isDeleted));

// expects to be called with (state, hikeId)
export const orderedTrailsByHikeIdSelector = createSelector(
  state => state.editor.trailsById,
  (_, hikeId) => hikeId,
  (trails, hikeId) => extractOrderedItems(trails, t => t.hikeId === hikeId && !t.isDeleted));

// expects to be called with (state, trailId)
export const orderedHikersByTrailIdSelector = createSelector(
  state => state.editor.hikersById,
  (_, trailId) => trailId,
  (hikers, trailId) => extractOrderedItems(hikers, k => k.trailId === trailId && !k.isDeleted));

export const hikeSelector = (state, id) => state.editor.hikesById[id];

export const trailSelector = (state, id) => state.editor.trailsById[id];

export const hikerSelector = (state, id) => state.editor.hikersById[id];

export const formSelector = state => state.editor.form;
export const simulationSelector = state => state.editor.simulation;

export const actionEnabledSelector = state => state.editor.actionEnabled;
export const actionValidSelector = state => state.editor.actionValid;

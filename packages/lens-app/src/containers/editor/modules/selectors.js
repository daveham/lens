import { createSelector } from 'reselect';

import _debug from 'debug';
const debug = _debug('lens:editor:modules:selectors');

export const simulationsLoadingSelector = state => state.editor.simulationsLoading;
export const simulationsSelector = state => state.editor.simulations;

export const hikesLoadingSelector = state => state.editor.hikesLoading;
export const hikesSelector = state => state.editor.hikes;

const emptyArray = [];
const orderComparer = (a, b) => a.order - b.order;
export const orderedHikesSelector = createSelector(
  state => state.editor.hikesById,
  hikes => {
    const values = Object.values(hikes);
    if (values.length > 0) {
      debug('orderedHikesSelector');
      return values.map(h => ({ id: h.id, name: h.name, order: h.order }))
        .sort(orderComparer);
    }
    return emptyArray;
  }
);

// expects to be called with (state, hikeId)
export const orderedTrailsByHikeIdSelector = createSelector(
  state => state.editor.trailsById,
  (_, hikeId) => hikeId,
  (trails, hikeId) => {
    const values = Object.values(trails);
    if (values.length > 0) {
      debug('orderedTrailsByHikeIdSelector');
      const filtered = values.filter(t => t.hikeId === hikeId && !t.isDeleted);
      if (filtered.length > 0) {
        return filtered.map(t => ({ id: t.id, name: t.name, order: t.order }))
          .sort(orderComparer);
      }
    }
    return emptyArray;
  }
);

// expects to be called with (state, trailId)
export const orderedHikersByTrailIdSelector = createSelector(
  state => state.editor.hikersById,
  (_, trailId) => trailId,
  (hikers, trailId) => {
    const values = Object.values(hikers);
    if (values.length > 0) {
      debug('orderedHikersByTrailIdSelector');
      return values.filter(k => k.trailId === trailId)
        .map(k => ({ id: k.id, name: k.name, order: k.order }))
        .sort(orderComparer);
    }
    return emptyArray;
  }
);

export const hikeSelector = (state, id) => state.editor.hikesById[id];

export const trailSelector = (state, id) => state.editor.trailsById[id];

export const hikerSelector = (state, id) => state.editor.hikersById[id];

export const formSelector = state => state.editor.form;
export const simulationSelector = state => state.editor.simulation;

export const actionEnabledSelector = state => state.editor.actionEnabled;
export const actionValidSelector = state => state.editor.actionValid;

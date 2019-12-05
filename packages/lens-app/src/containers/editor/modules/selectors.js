import { createSelector } from 'reselect';
import groupby from 'lodash.groupby';

// import _debug from 'debug';
// const debug = _debug('lens:editor:modules:selectors');

export const simulationsLoadingSelector = state => state.editor.simulationsLoading;
export const simulationsSelector = state => state.editor.simulations;
export const selectedSimulationSelector = state => state.editor.simulation;
export const selectedExecutionSelector = state => state.editor.execution;
export const selectedRenderingSelector = state => state.editor.rendering;
export const simulationByIdSelector = (state, id) =>
  state.editor.simulations.find(s => s.id === id);
export const executionByIdSelector = (state, simulationId, id) => {
  const simulation = simulationByIdSelector(state, simulationId);
  return simulation ? simulation.executions.find(e => e.id === id) : simulation;
};
export const renderingByIdSelector = (state, simulationId, executionId, id) => {
  const execution = executionByIdSelector(state, simulationId, executionId);
  return execution ? execution.renderings.find(r => r.id === id) : execution;
};

export const operationPendingSelector = state => state.editor.operationPending;
export const operationEndedSelector = state => state.editor.operationEnded;

export const hikesLoadingSelector = state => state.editor.hikesLoading;

const emptyArray = [];
const orderComparer = (a, b) => a.order - b.order;
const orderedItemExtractor = ({ id, order, name, nameError }) => {
  const item = {
    id,
    order,
    name: name || '* error *',
  };
  if (nameError) {
    item.hasError = true;
  }

  return item;
};
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

export const hikesSelector = createSelector(
  state => state.editor.hikesById,
  state => state.editor.trailsById,
  state => state.editor.hikersById,
  (hikes, trails, hikers) => {
    const trailsGrouped = groupby(trails, 'hikeId');
    const hikersGrouped = groupby(hikers, 'trailId');

    const hikesFiltered = Object.keys(hikes)
      .map(key => hikes[key])
      .filter(h => !h.isDeleted)
      .map(h => ({ ...h }));

    return hikesFiltered.map(hike => {
      const ownedTrails = trailsGrouped[hike.id];
      const ownedTrailsFiltered = ownedTrails
        ? ownedTrails.filter(t => !t.isDeleted).map(t => ({ ...t }))
        : undefined;

      if (ownedTrailsFiltered && ownedTrailsFiltered.length) {
        hike.trails = ownedTrailsFiltered;
        ownedTrailsFiltered.forEach(t => {
          const ownedHikers = hikersGrouped[t.id];
          const ownedHikersFiltered = ownedHikers
            ? ownedHikers.filter(k => !k.isDeleted).map(k => ({ ...k }))
            : undefined;

          if (ownedHikersFiltered && ownedHikersFiltered.length) {
            t.hikers = ownedHikersFiltered;
          }
        });
      }
      return hike;
    });
  },
);

export const simulationDeleteListSelector = createSelector(
  simulationByIdSelector,
  simulation => {
    const items = [];
    if (simulation) {
      items.push({ key: simulation.id, type: 'simulation', name: simulation.name });
      simulation.executions.forEach(e => {
        items.push({ key: e.id, type: 'execution', name: e.name });
        e.renderings.forEach(r => {
          items.push({ key: r.id, type: 'rendering', name: r.name });
        });
      });
    }
    return items;
  },
);

export const executionDeleteListSelector = createSelector(
  executionByIdSelector,
  execution => {
    const items = [];
    if (execution) {
      items.push({ key: execution.id, type: 'execution', name: execution.name });
      execution.renderings.forEach(r => {
        items.push({ key: r.id, type: 'rendering', name: r.name });
      });
    }
    return items;
  },
);

export const renderingDeleteListSelector = createSelector(
  renderingByIdSelector,
  rendering => {
    const items = [];
    if (rendering) {
      items.push({ key: rendering.id, type: 'rendering', name: rendering.name });
    }
    return items;
  },
);

export const orderedHikesSelector = createSelector(
  state => state.editor.hikesById,
  hikes => extractOrderedItems(hikes, h => !h.isDeleted),
);

// expects to be called with (state, hikeId)
export const orderedTrailsByHikeIdSelector = createSelector(
  state => state.editor.trailsById,
  (_, hikeId) => hikeId,
  (trails, hikeId) => extractOrderedItems(trails, t => t.hikeId === hikeId && !t.isDeleted),
);

// expects to be called with (state, trailId)
export const orderedHikersByTrailIdSelector = createSelector(
  state => state.editor.hikersById,
  (_, trailId) => trailId,
  (hikers, trailId) => extractOrderedItems(hikers, k => k.trailId === trailId && !k.isDeleted),
);

export const allHikesValid = createSelector(
  state => state.editor.hikesById,
  hikes => !Object.values(hikes).some(h => h.nameError),
);

export const allTrailsValid = createSelector(
  state => state.editor.trailsById,
  trails => !Object.values(trails).some(t => t.nameError),
);

export const allHikersValid = createSelector(
  state => state.editor.hikersById,
  hikers => !Object.values(hikers).some(k => k.nameError),
);

export const simulationValid = createSelector(
  selectedSimulationSelector,
  simulation => !simulation.nameError,
);

export const simulationAndDataValid = createSelector(
  simulationValid,
  allHikesValid,
  allTrailsValid,
  allHikersValid,
  (isSimulationValid, areHikesValid, areTrailsValid, areHikersValid) =>
    isSimulationValid && areHikesValid && areTrailsValid && areHikersValid,
);

export const executionValid = createSelector(
  selectedExecutionSelector,
  execution => !execution.nameError,
);

export const renderingValid = createSelector(
  selectedRenderingSelector,
  rendering => !rendering.nameError,
);

export const hikeSelector = (state, id) => state.editor.hikesById[id];

export const trailSelector = (state, id) => state.editor.trailsById[id];

export const hikerSelector = (state, id) => state.editor.hikersById[id];

export const actionValidSelector = state => state.editor.actionValid;

import yaml from 'js-yaml';

import Simulation from './simulation';
import SimulationFactory from './simulationFactory';

import getDebugLog from './debugLog';
const debug = getDebugLog('simulationBuilder');

export function parse(document, options = {}) {
  const doc = yaml.safeLoad(document);
  debug('parse', { doc: JSON.stringify(doc), options });
  return doc;
}

export default function build(model, plan, definition, options = {}) {
  debug('build', { model, plan, options });

  const factory = new SimulationFactory();
  factory.initialize(plan, model);

  const simulation = new Simulation(options);

  // all entities (h, t, k) can contain optional { id, name }
  definition.hikes.forEach(({ trails, ...h }) => {
    // h: { type, options }
    const hike = factory.createHike(h);
    simulation.addHike(hike);

    trails.forEach(({ hikers, ...t }) => {
      // t: { type, options, modifiers }
      const trail = factory.createTrail(t);
      trail.initialize(plan, hike);
      hike.addTrail(trail);

      // k: { type, options, movementBehavior, actionBehavior, dataBehavior }
      hikers.forEach(k => {
        const hiker = factory.createHiker(k);
        hiker.initialize(trail);
        trail.addHiker(hiker);
      });
    });
  });

  return simulation;
}

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

  definition.hikes.forEach(h => {
    const hike = factory.createHike(h);
    simulation.addHike(hike);

    h.trails.forEach(t => {
      const trail = factory.createTrail(t);
      trail.initialize(plan, hike);
      hike.addTrail(trail);

      t.hikers.forEach(k => {
        const hiker = factory.createHiker(k);
        hiker.initialize(trail);
        trail.addHiker(hiker);
      });
    });
  });

  return simulation;
}

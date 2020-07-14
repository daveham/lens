import yaml from 'js-yaml';

import Simulation from './simulation';

import getDebugLog from './debugLog';
const debug = getDebugLog('simulationBuilder');

export function parse(document, options = {}) {
  const doc = yaml.safeLoad(document);
  debug('parse', { doc: JSON.stringify(doc), options });
  return doc;
}

export default function build(options) {
  debug('build', options);
  return new Simulation(options);
}

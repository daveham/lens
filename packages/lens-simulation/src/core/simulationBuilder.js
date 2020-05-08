import Simulation from './simulation';

import getDebugLog from './debugLog';
const debug = getDebugLog('simulationBuilder');

export default function build(options) {
  debug('build', options);
  return new Simulation(options);
}

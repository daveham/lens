import getParentDebugLog from '../debugLog';

const segment = 'simulationShow';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}

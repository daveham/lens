import getParentDebugLog from '../debugLog';

const segment = 'simulationEmptyState';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
